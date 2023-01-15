import { HitScore } from "./entities/HitObjects";

const SCORE_MULTIPLIER: Record<HitScore, number> = {
    Miss: 0,
    Okay: 1,
    Good: 1.5,
    Perfect: 2,
}

export interface ScoreData {
    score: number;
    maxCombo: number;
    hitMap: Record<HitScore, number>;
}

export class ScoreKeeper {
    protected score: number = 0;
    protected currentCombo: number = 0;
    protected maxCombo: number = 0;
    protected hitMap: Record<HitScore, number> = {
        Perfect: 0,
        Good: 0,
        Okay: 0,
        Miss: 0,
    };

    constructor() { }

    public addHit(score: HitScore, length: number, resetCombo: boolean = false) {
        if (score == HitScore.Miss || resetCombo) {
            this.currentCombo = 0;
        } else {
            this.currentCombo++;
            if (this.currentCombo > this.maxCombo) this.maxCombo = this.currentCombo;
        }

        this.hitMap[score]++;

        const eCombo = Math.max(this.currentCombo, 2);
        this.score += (eCombo / 2) * Math.log(length) * SCORE_MULTIPLIER[score];
    }

    public get Score() {
        return Math.round(this.score * 10);
    }

    public get Combo() {
        return this.currentCombo;
    }

    public get Stats(): ScoreData {
        return { score: this.Score, hitMap: this.hitMap, maxCombo: this.maxCombo };
    }
}