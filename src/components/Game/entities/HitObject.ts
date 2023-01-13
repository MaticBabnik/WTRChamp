import type { Game, IEntity } from "../game";
import type { HitObjects } from "./HitObjects";
import type { PitchTime, SongHitObject } from "../util/parser"
import { type Rect, type Point, remap } from "../util/util";
import { Constants } from "../constants";

export class HitObject implements IEntity, SongHitObject {
    public start: number;
    public end: number;
    public pitches: PitchTime[];

    constructor(
        protected g: Game,
        protected hos: HitObjects,
        sho: SongHitObject,
        public index: Number) {
        this.start = sho.start;
        this.pitches = sho.pitches;
        this.end = sho.end;
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

        // ctx.fillStyle = 'white';
        // ctx.strokeStyle = 'red';
        // ctx.lineWidth = 20;

        // ctx.beginPath();
        // ctx.arc(sX, sP, 7, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(eX, eP, 7, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.fill();
        // ctx.closePath();

    }
}