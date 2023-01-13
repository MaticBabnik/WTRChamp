import type { Game, IEntity } from "../game";

export class Grid implements IEntity {
    constructor(protected g: Game) {
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;


        const gr = this.g.gameRect;

        ctx.beginPath();

        ctx.moveTo(gr.x, gr.y); //grid
        ctx.lineTo(gr.x + gr.w, gr.y);

        ctx.moveTo(gr.x, gr.y + gr.h);
        ctx.lineTo(gr.x + gr.w, gr.y + gr.h);

        ctx.moveTo(gr.x, this.g.h / 2);
        ctx.lineTo(gr.x + gr.w, this.g.h / 2);

        ctx.lineWidth = 3;
        ctx.moveTo(gr.x, 0);
        ctx.lineTo(gr.x, this.g.h);

        ctx.stroke();
    }
}