import { defineStore } from 'pinia'

export const useRoundStore = defineStore('round', {
    state: () => ({
        round: 1,
        score: 0,
        locations: [] as string[],
    }),
    actions: {
        nextRound() {
            this.round += 1;
        },
        addScore(score: number) {
            this.score += score;
        },
        setLocations(locations: string[]) {
            this.locations = locations;
        },
        reset() {
            this.score = 0;
            this.round = 1;
            this.locations = [];
        },
    },
})
