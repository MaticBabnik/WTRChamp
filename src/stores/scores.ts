import { defineStore } from "pinia";

interface Score {
    name: string; score: number
}

type MapScores = Record<string, Score[]>;

export const useScoresStore = defineStore('highscores', {
    state() {
        let stored: MapScores | null = null;

        try {
            const d = localStorage.getItem('highscores');
            stored = JSON.parse(d ?? '');
            console.log(`Read ${Object.keys(stored ?? {}).length} highscore lists from localStorage`);

        } catch {
            // if loading fails we write the defaults
            console.warn('Highscores corrupted')
            localStorage.setItem('highscores', JSON.stringify(stored = {}));
        }

        return {
            scores: stored as MapScores
        };
    },
    actions: {
        addScore(mapKey: string, name: string, score: number) {

            const scores = this.scores[mapKey] ?? [];

            scores.push({ name, score });
            scores.sort((a, b) => b.score - a.score);
            this.scores[mapKey] = scores.slice(0, 5);

            localStorage.setItem('highscores', JSON.stringify(this.scores));
        }
    }

});