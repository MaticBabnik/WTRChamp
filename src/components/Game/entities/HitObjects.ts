import type { Game, IEntity } from "../game";
import type { Song } from "../util/parser";
import { HitObject } from "./HitObject";

export enum HitScore {
    Miss = 'Miss',
    OK = 'OK',
    Good = 'Good',
    Perfect = 'Perfect'
}

export class HitObjects implements IEntity {
    protected window: number;
    protected song: Song;
    protected activeHitObjects: HitObject[] = [];
    protected hitObjectIndex = 0;

    constructor(protected g: Game) {
        this.window = g.settings.gameplay.timeWindow;
        this.song = g.song;
    }

    protected checkActive(tLeft: number, tRight: number) {
        const next = this.song.HitObjects[this.hitObjectIndex]
        if (next) {
            if (next.start <= tRight) {
                this.activeHitObjects.push(new HitObject(this.g, this, next, this.hitObjectIndex));
                console.log({ns:next.start});
                this.hitObjectIndex++;
            }
        }

        const nextOut = this.activeHitObjects[0];
        if (nextOut) {
            if (nextOut.end <= tLeft) {
                this.activeHitObjects.shift()
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        const t = this.g.time;
        const gr = this.g.gameRect;
        const tLeft = t, tRight = t + this.window;

        this.checkActive(tLeft, tRight);

        this.activeHitObjects.forEach(h => h.render(ctx, tLeft, tRight, gr));
    }

    public score(index: number, length: number, score: HitScore, forceResetCombo?: boolean) {
        console.log({ index, length, score, forceResetCombo });

    }
}