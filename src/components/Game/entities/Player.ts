import type { Game, IEntity } from "../game";
import { Constants } from "../constants";
import { remap, clamp } from "../util/util";

export class Player implements IEntity {
    protected gY = 0;

    public get playerPitch() {
        return this.gY;
    }

    constructor(protected g: Game) {
        this.g.registerEventHandler(this.g.canvas, 'mousemove', this.move.bind(this))
    }

    move(e: MouseEvent) {
        const input = -e.movementY;
        const scalingRatio = (this.g.settings.controls.sensitivity * Constants.PITCH_RANGE) / Constants.PLAYFIELD_H;
        const scaled = input * scalingRatio;
        const clamped = clamp(Constants.PITCH_MIN, scaled + this.gY, Constants.PITCH_MAX);
        this.gY = clamped;
    }

    public render(ctx: CanvasRenderingContext2D) {
        const gr = this.g.gameRect;

        ctx.beginPath();
        ctx.arc(gr.x, remap(this.gY, Constants.PITCH_MAX, Constants.PITCH_MIN, gr.y, gr.y + gr.h), Constants.PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.fill();

        ctx.stroke();
    }
}