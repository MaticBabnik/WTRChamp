import { Constants } from "../constants";
import type { Game, IEntity } from "../game";
import { remap } from "../util/util";
import type { HitScore } from "./HitObjects";

interface HitIndicator {
    type: HitScore,
    firedAt: number
}

const HIT2COLOR: Record<HitScore, string> = {
    Miss: '#F00',
    Okay: '#000',
    Good: '#0FF',
    Perfect: '#0F0',
}

export class HitIndicators implements IEntity {
    protected indicators: HitIndicator[] = [];
    constructor(protected g: Game) {
    }

    public hit(type: HitScore) {
        this.indicators.push({ type, firedAt: this.g.time });
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (this.indicators.length == 0) return;
        const time = this.g.time;
        const gr = this.g.gameRect;


        ctx.font = "144px 'Open Sans'";
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;

        this.indicators = this.indicators.filter(ind => {
            const life = time - ind.firedAt;
            if (life > Constants.HIT_INDICATOR_LIFE) return false; //die

            //   /--_
            //  |    --_
            // /        --_  should animate something like this
            const opacity = life < Constants.HIT_INDICATOR_MAXVIS ?
                life / Constants.HIT_INDICATOR_MAXVIS :
                remap(life, Constants.HIT_INDICATOR_MAXVIS, Constants.HIT_INDICATOR_LIFE, 1, 0);

            // ---_
            //     --__
            //         --__ should animate something like this
            const midY = this.g.h / 2;
            const y = life < Constants.HIT_INDICATOR_MAXVIS ?
                midY :
                remap(life, Constants.HIT_INDICATOR_MAXVIS, Constants.HIT_INDICATOR_LIFE, midY, midY / 2)

            ctx.globalAlpha = opacity;
            ctx.shadowColor = HIT2COLOR[ind.type];
            ctx.strokeText(ind.type, gr.x + gr.w / 2, y);
            ctx.fillText(ind.type, gr.x + gr.w / 2, y);

            return true;
        });

        ctx.globalAlpha = 1;
        ctx.shadowColor = '';
        ctx.shadowBlur = 0;
    }
}