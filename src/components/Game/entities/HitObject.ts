import type { Game, IEntity } from "../game";
import type { HitObjects } from "./HitObjects";
import type { PitchTime, SongHitObject } from "../util/parser"
import { type Rect, type Point, remap, bezierPoint } from "../util/util";
import { Constants } from "../constants";

interface HitBoxSegment {
    startTime: number;
    startPitch: number;
    slope: number;
}

export class HitObject implements IEntity {
    public start: number;
    public end: number;
    public pitches: PitchTime[];
    public hitbox: HitBoxSegment[];

    static hitboxLineSegments(ho: SongHitObject) {
        const hb: HitBoxSegment[] = [];
        let ppt = ho.pitches[0];

        for (let i = 1; i < ho.pitches.length; i++) {
            const npt = ho.pitches[i];
            if (ppt.pitch != npt.pitch) {
                //bezier
                const avrgTime = (ppt.time + npt.time);

                const cp: Point[] = [      // put control points in this shape
                    [ppt.time, ppt.pitch], // ---|
                    [avrgTime, ppt.pitch], //    |
                    [avrgTime, npt.pitch], //    |
                    [npt.time, npt.pitch]  //    |---
                ];

                const bezierPoints = [...Array(Constants.HITBOX_RESOLUTION)]
                    .map((x, i) => i / (Constants.HITBOX_RESOLUTION - 1))
                    .map(n => bezierPoint(cp, n));

                for (let j = 0; j < bezierPoint.length - 1; j++) {
                    const bp = bezierPoints[j];
                    const nbp = bezierPoints[j + 1];

                    hb.push({
                        startTime: bp[0],
                        startPitch: bp[1],
                        slope: (nbp[1] - bp[1]) / (nbp[0] - bp[0])
                    })
                }

            } else {
                hb.push({
                    startTime: ppt.time,
                    startPitch: ppt.pitch,
                    slope: 0
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
        public index: Number) {
        this.start = sho.start;
        this.pitches = sho.pitches;
        this.end = sho.end;
        this.hitbox = HitObject.hitboxLineSegments(sho);
    }

    public render(ctx: CanvasRenderingContext2D, tLeft?: number, tRight?: number, gr?: Rect) {
        if (typeof tLeft != 'number' || typeof tRight != 'number' || !gr) {
            tLeft = this.g.time;
            tRight = this.g.settings.gameplay.timeWindow + tLeft;
            gr = this.g.gameRect;
        }

        const minX = gr.x, maxX = gr.x + gr.w, minY = gr.y, maxY = gr.y + gr.h;

        const l = this.pitches.length;

        const sX = remap(this.pitches[0].time, tLeft, tRight, minX, maxX);
        const sP = remap(this.pitches[0].pitch, Constants.PITCH_MIN, Constants.PITCH_MAX, maxY, minY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round'

        ctx.beginPath();
        ctx.moveTo(sX, sP);

        let cX = sX, cP = sP, eX = 0, eP = 0;

        for (let i = 1; i < l; i++) {
            eX = remap(this.pitches[i].time, tLeft, tRight, minX, maxX);
            eP = remap(this.pitches[i].pitch, Constants.PITCH_MIN, Constants.PITCH_MAX, maxY, minY);

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
    }
}