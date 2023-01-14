import type { Game, IEntity } from "../game";
import { Constants } from "../constants";
import { remap, clamp } from "../util/util";
import { Trombone } from "../audio/trombone";

export class Player implements IEntity {
    protected gY = 0;
    protected trombone: Trombone;
    protected trSynced: boolean = true;
    protected trPlaying: boolean = false;

    public get playerPitch() {
        return this.gY;
    }

    constructor(protected g: Game) {
        this.g.registerEventHandler(this.g.canvas, 'mousemove', this.move.bind(this))
        this.trombone = new Trombone(g.settings.volume.sfx * g.settings.volume.master);
    }

    move(e: MouseEvent) {
        const input = -e.movementY;
        const scalingRatio = (this.g.settings.controls.sensitivity * Constants.PITCH_RANGE) / Constants.PLAYFIELD_H;
        const scaled = input * scalingRatio;
        const clamped = clamp(Constants.PITCH_MIN, scaled + this.gY, Constants.PITCH_MAX);
        this.gY = clamped;
        this.trSynced = false;
    }

    public render(ctx: CanvasRenderingContext2D) {
        const gr = this.g.gameRect;
        const playing = this.g.keyboard.play.state;

        ctx.beginPath();
        ctx.arc(gr.x, remap(this.gY, Constants.PITCH_MAX, Constants.PITCH_MIN, gr.y, gr.y + gr.h), Constants.PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = '#fff';
        ctx.shadowColor = "#fff";
        ctx.lineWidth = playing ? 5 : 3;
        ctx.shadowBlur = playing ? 5 : 0;
        ctx.fill();
        ctx.stroke();

        if (this.trPlaying != playing || !this.trSynced) {
            if (playing) {
                this.trombone.play(this.gY);
            } else {
                this.trombone.stop();
            }
            this.trSynced = true;
            this.trPlaying = playing;
        }

        ctx.shadowColor = '';
        ctx.shadowBlur = 0;
    }
}