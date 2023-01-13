import type { IEntity, Game, Kkey } from "../game";

export class HoldAction implements IEntity {
    constructor(
        protected g: Game,
        protected key: Kkey,
        protected holdTime: number,
        protected text: string,
        protected callback: () => any
    ) { }

    protected lastTriggered = 0;

    public render(ctx: CanvasRenderingContext2D) {
        const key = this.g.keyboard[this.key];
        const now = this.g.time;

        if (!key.state) return;

        if (key.since + this.holdTime <= now) {
            if (key.since = this.lastTriggered) return;

            this.lastTriggered = key.since;
            this.callback();
            return;
        }

        const progress = (now - key.since) / this.holdTime;
        ctx.fillStyle = `rgba(0,0,0,${progress})`;
        ctx.fillRect(0, 0, this.g.w, this.g.h);

        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.font = "48px 'Open Sans'";
        ctx.strokeText(this.text, this.g.w / 2, this.g.h / 2 - 20);
        ctx.fillText(this.text, this.g.w / 2, this.g.h / 2 - 20);

        ctx.strokeStyle = '#f00';
        ctx.lineCap = 'butt';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(this.g.w / 2, this.g.h / 2 + 20, 20, 0, 2 * Math.PI * progress);
        ctx.stroke();
    }

}