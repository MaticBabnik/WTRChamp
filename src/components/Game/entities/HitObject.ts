import type { Game, IEntity } from "../game";
import type { HitObjects } from "./HitObjects";
import type { PitchTime, SongHitObject } from "../util/parser"
import { type Rect, type Point, remap, bezierPoint } from "../util/util";
import { Constants } from "../constants";

interface HitBoxSegment {
    startTime: number;
    startPitch: number;
    slope: number;
    endTime: number;
}

export interface Tracking {
    hit: boolean;
    hitOffset: number;
    framesIn: number;
    framesTotal: number;
}

type MapRanges = [number, number, number, number];

export class HitObject implements IEntity {
    public start: number;
    public end: number;
    public pitches: PitchTime[];
    public hitbox: HitBoxSegment[];

    public tracking: Tracking = {
        hit: false,
        hitOffset: Infinity,
        framesIn: 0,
        framesTotal: 0
    };

    static hitboxLineSegments(ho: SongHitObject) {
        const hb: HitBoxSegment[] = [];
        let ppt = ho.pitches[0];

        for (let i = 1; i < ho.pitches.length; i++) {
            const npt = ho.pitches[i];
            if (ppt.pitch != npt.pitch) {
                //bezier
                const avrgTime = (ppt.time + npt.time) / 2;

                const cp: Point[] = [      // put control points in this shape
                    [ppt.time, ppt.pitch], // ---|
                    [avrgTime, ppt.pitch], //    |
                    [avrgTime, npt.pitch], //    |
                    [npt.time, npt.pitch]  //    |---
                ];

                const bezierPoints = [...Array(Constants.HITBOX_RESOLUTION)]
                    .map((x, i) => i / (Constants.HITBOX_RESOLUTION - 1))
                    .map(n => bezierPoint(cp, n));

                for (let j = 0; j < bezierPoints.length - 1; j++) {
                    const bp = bezierPoints[j];
                    const nbp = bezierPoints[j + 1];

                    hb.push({
                        startTime: bp[0],
                        startPitch: bp[1],
                        slope: (nbp[1] - bp[1]) / (nbp[0] - bp[0]),
                        endTime: nbp[0]
                    })
                }

            } else {
                hb.push({
                    startTime: ppt.time,
                    startPitch: ppt.pitch,
                    slope: 0,
                    endTime: npt.time
                })
            }

            ppt = npt;
        }
        return hb;
    }

    constructor(
        protected g: Game,
        protected hos: HitObjects,
        sho: SongHitObject,
        public index: number) {
        this.start = sho.start;
        this.pitches = sho.pitches;
        this.end = sho.end;
        this.hitbox = HitObject.hitboxLineSegments(sho);

        if (index == 0) console.log(this);
    }

    protected getHitboxSegment(t: number) {
        return this.hitbox.find(seg => seg.startTime < t && seg.endTime > t);
    }

    protected static solveHitbox(time: number, offset: number, segment: HitBoxSegment) {
        const rawPitch = segment.slope * (segment.endTime - segment.startTime) + segment.startPitch;
        const allowedOffset = offset * Math.max(Math.abs(segment.slope), 1);
        return rawPitch + allowedOffset;
    }

    public render(ctx: CanvasRenderingContext2D, tLeft?: number, tRight?: number, gr?: Rect) {
        if (typeof tLeft != 'number' || typeof tRight != 'number' || !gr) {
            tLeft = this.g.time;
            tRight = this.g.settings.gameplay.timeWindow + tLeft;
            gr = this.g.gameRect;
        }

        const minX = gr.x, maxX = gr.x + gr.w, minY = gr.y, maxY = gr.y + gr.h;
        const l = this.pitches.length;

        const timeRemapArgs: MapRanges = [tLeft, tRight, minX, maxX],
            pitchRemapArgs: MapRanges = [Constants.PITCH_MIN, Constants.PITCH_MAX, maxY, minY];


        const sX = remap(this.pitches[0].time, ...timeRemapArgs);
        const sP = remap(this.pitches[0].pitch, ...pitchRemapArgs);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round'

        ctx.beginPath();
        ctx.moveTo(sX, sP);

        let cX = sX, cP = sP, eX = 0, eP = 0;

        for (let i = 1; i < l; i++) {
            eX = remap(this.pitches[i].time, ...timeRemapArgs);
            eP = remap(this.pitches[i].pitch, ...pitchRemapArgs);

            if (cP == eP) //pitch is same; straight line
                ctx.lineTo(eX, eP);
            else {
                const xMiddle = (cX + eX) / 2;
                ctx.bezierCurveTo(xMiddle, cP, xMiddle, eP, eX, eP);
            }

            [cX, cP] = [eX, eP];
        }
        ctx.stroke();
        ctx.closePath();

        if (this.start < tLeft && this.end > tLeft) {
            this.score(tLeft);

            if (this.g.settings.developer.debugHitbox) {
                ctx.strokeStyle = '#0f08';
                ctx.lineWidth = 50;
                ctx.lineCap = 'round';
                ctx.beginPath();

                this.hitbox.forEach(segment => {
                    ctx.moveTo(remap(segment.startTime, ...timeRemapArgs),
                        remap(segment.startPitch, ...pitchRemapArgs))

                    ctx.lineTo(remap(segment.endTime, ...timeRemapArgs),
                        remap(segment.slope * (segment.endTime - segment.startTime) +
                            segment.startPitch, ...pitchRemapArgs));
                })

                ctx.stroke();

                ctx.strokeStyle = '#f0f8';
                ctx.lineWidth = 30;
                ctx.lineCap = 'butt';

                const activeHb = this.getHitboxSegment(tLeft);
                if (!activeHb) return;
                const min = HitObject.solveHitbox(tLeft, -Constants.HIT_MAX_DIST, activeHb);
                const max = HitObject.solveHitbox(tLeft, Constants.HIT_MAX_DIST, activeHb);

                ctx.beginPath();
                ctx.moveTo(gr.x, remap(min, ...pitchRemapArgs));
                ctx.lineTo(gr.x, remap(max, ...pitchRemapArgs));
                ctx.stroke();
            }
        }
    }

    protected trackingCheckHitbox(t: number, p: number) {
        const activeHb = this.getHitboxSegment(t);
        if (!activeHb) return true;
        const min = HitObject.solveHitbox(t, -Constants.HIT_MAX_DIST, activeHb);
        const max = HitObject.solveHitbox(t, Constants.HIT_MAX_DIST, activeHb);

        return (min < p && p < max)
    }

    protected score(t: number) {
        const p = this.g.keyboard.play;
        if (!this.tracking.hit) {
            if (p.state) {
                this.tracking.hit = true;
                this.tracking.hitOffset = p.since - this.start;
                this.tracking.framesTotal++;
                if (this.trackingCheckHitbox(t, this.g.playerPitch))
                    this.tracking.framesIn++;
            }
        } else {
            this.tracking.framesTotal++;
            if (p.state && this.trackingCheckHitbox(t, this.g.playerPitch)) this.tracking.framesIn++;
        }
    }
}