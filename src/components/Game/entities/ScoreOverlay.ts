import type { Game, IEntity } from "../game";

export class ScoreOverlay implements IEntity {
    constructor(protected g: Game) {
    }

    public render(ctx: CanvasRenderingContext2D) {
        const s = this.g.scoreKeeper;

        ctx.font = "48px 'Open Sans'";
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 5;
        ctx.textBaseline = 'top';

        ctx.textAlign = "right";
        ctx.fillText(s.Score.toString(), this.g.w - 10, 30);
        ctx.textAlign = "left";
        ctx.fillText(s.Combo.toString(), 10, 30);

        ctx.font = "24px 'Open Sans'";
        ctx.textBaseline = 'bottom';

        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#f44';
        ctx.textAlign = "right";
        ctx.fillText('Score:', this.g.w - 10, 28);
        ctx.textAlign = "left";
        ctx.fillText('Combo:', 10, 28);

        ctx.shadowColor = '';
        ctx.shadowBlur = 0;

    }
}