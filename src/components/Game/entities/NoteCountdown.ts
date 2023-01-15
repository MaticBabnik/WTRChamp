import { Constants } from "../constants";
import { formatTime, remap } from "../util/util"
import type { Game, IEntity } from "../game";
import type { HitObjects } from "./HitObjects";

export class NoteCountdown implements IEntity {
    constructor(protected g: Game, protected hitobjects: HitObjects) {
    }

    protected show = false;
    protected start = 0;
    protected end = 0;

    public render(ctx: CanvasRenderingContext2D) {
        const next = this.hitobjects.NextHitObjectTime,
            now = this.g.time,
            timeToNext = next - now;

        if (!this.show) {
            if (timeToNext > Constants.COUNTDOWN_MIN_PAUSE) {
                this.show = true;
                this.start = this.g.time;
                this.end = next - Constants.COUNTDOWN_HIDE_TIME;
            }
        } else {
            if (timeToNext < Constants.COUNTDOWN_HIDE_TIME) {
                this.show = false;
            }
        }


        if (this.show) {

            ctx.font = "48px 'Orbitron'";
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#000';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 5;

            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";

            const endFadein = this.start + Constants.COUNTDOWN_ANIM_TIME,
                startFadeOut = this.end - Constants.COUNTDOWN_ANIM_TIME;
            if (now < endFadein) {
                ctx.globalAlpha = remap(now, this.start, endFadein, 0, 1);
            }
            if (now > startFadeOut) {
                ctx.globalAlpha = remap(now, startFadeOut, this.end, 1, 0);
            }
            ctx.fillText(formatTime(next - this.g.time), this.g.w / 2, this.g.h / 2);
            ctx.globalAlpha = 1;
            ctx.shadowColor = '';
            ctx.shadowBlur = 0;
        }
    }
}