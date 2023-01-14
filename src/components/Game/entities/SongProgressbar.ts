import { Constants } from "../constants";
import type { Game, IEntity } from "../game";

export class SongProgressbar implements IEntity {
    constructor(protected g: Game, protected end: number) {
    }

    public render(ctx: CanvasRenderingContext2D) {
        const { w, h } = this.g;

        const progress = this.g.time / this.end;

        ctx.fillStyle = '#fff8';
        ctx.fillRect(0, h - Constants.PROGRESSBAR_HEIGHT, w, Constants.PROGRESSBAR_HEIGHT);

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, h - Constants.PROGRESSBAR_HEIGHT, w * progress, Constants.PROGRESSBAR_HEIGHT);
    }
}