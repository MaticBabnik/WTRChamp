import { Constants } from "../constants";
import type { Game, IEntity } from "../game";
import type { Song } from "../util/parser";
import type { HitIndicators } from "./HitIndicators";
import { HitObject, type Tracking } from "./HitObject";

export enum HitScore {
    Miss = 'Miss',
    OK = 'Okay',
    Good = 'Good',
    Perfect = 'Perfect'
}

const HITOFFSET2SCORE: [number, HitScore][] = [
    [Constants.HIT_PERFECT, HitScore.Perfect],
    [Constants.HIT_GOOD, HitScore.Good],
    [Constants.HIT_OK, HitScore.OK],
    [Infinity, HitScore.Miss]
]
export class HitObjects implements IEntity {
    protected window: number;
    protected song: Song;
    protected activeHitObjects: HitObject[] = [];
    protected hitObjectIndex = 0;

    constructor(protected g: Game, protected hi: HitIndicators) {
        this.window = g.settings.gameplay.timeWindow;
        this.song = g.song;
    }

    protected checkActive(tLeft: number, tRight: number) {
        const next = this.song.HitObjects[this.hitObjectIndex]
        if (next) {
            if (next.start <= tRight) {
                this.activeHitObjects.push(new HitObject(this.g, this, next, this.hitObjectIndex));
                this.hitObjectIndex++;
            }
        }

        const nextOut = this.activeHitObjects[0];
        if (nextOut) {
            if (nextOut.end <= tLeft) {
                const ho = this.activeHitObjects.shift();
                if (!ho) return;
                this.scoreHitObject(ho.index, ho.tracking, ho.end - ho.start);
            }
        }
    }

    protected scoreHitObject(index: number, tracking: Tracking, length: number) {
        if (tracking.hit) {
            // We only actually care that you don't hit it too late, hence the Math.min
            // Trombone champ does something like this too
            // You will still loose your combo tho
            const offset = Math.abs(Math.max(-Constants.HIT_OK, tracking.hitOffset));
            let score = HITOFFSET2SCORE.find(x => offset <= x[0])?.[1] as HitScore;

            const hitRatio = tracking.framesIn / tracking.framesTotal;
            if (score != HitScore.Miss) {
                if (hitRatio < 0.75) score = HitScore.Miss;
            }

            this.hi.hit(score);
            this.g.scoreKeeper.addHit(score, length, tracking.hitOffset < -Constants.HIT_OK);
            console.log(`%cHit #${index} @ ${offset} (raw: ${tracking.hitOffset}) ${(hitRatio * 100).toFixed(0)}% scored as ${score}`, score == HitScore.Miss ? 'color: #f00;' : 'color: #0f0;');
        } else {
            this.hi.hit(HitScore.Miss);
            this.g.scoreKeeper.addHit(HitScore.Miss, length);
            console.log(`%cMissed #${index}`, 'color: #f00;');
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        const t = this.g.time;
        const gr = this.g.gameRect;
        const tLeft = t, tRight = t + this.window;

        this.checkActive(tLeft, tRight);

        this.activeHitObjects.forEach(h => h.render(ctx, tLeft, tRight, gr));
    }

    public get AnyActiveHitObjects() {
        return this.activeHitObjects.length > 0;
    }

    public get NextHitObjectTime() {
        return this.activeHitObjects[0]?.start ?? this.song.HitObjects[this.hitObjectIndex]?.start ?? -1;
    }
}