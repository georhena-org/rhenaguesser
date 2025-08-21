import { defineStore } from 'pinia'
import { useRoundStore } from './round' // Import the second store

export interface Player {
    id: string
    username: string
}

export interface Guess {
    playerId: string
    latitude: number
    longitude: number
    distance?: number
    score?: number
}

export interface MultiplayerStore {
    connected: boolean;
    gameId: string | null;
    playerId: string | null;
    players: Player[];
    currentLocationId: string | null;
    realLocation: { lat: number; lng: number } | null;
    guesses: Guess[];
    loading: boolean;
    error: string | null;
}


export const useMultiplayer = defineStore('multiplayer', {
    state: (): MultiplayerStore => ({
        connected: false,
        gameId: null,
        playerId: null,
        players: [],
        currentLocationId: null,
        realLocation: null,
        guesses: [],
        loading: false,
        error: null,

    }),
    actions: {
        async initializeWebSocket() {
            try {
                const ws = new WebSocket(`${window.location.origin.replace('http', 'ws')}/api/ws`)

                ws.onopen = () => {
                    this.connected = true
                    this.error = null;

                    setInterval(() => {
                        ws.send(JSON.stringify({ action: 'ping' }))
                    }, 10000)
                }

                ws.onclose = () => {
                    this.connected = false
                }

                ws.onerror = () => {
                    this.error = 'WebSocket connection error'
                }

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    this.handleWebSocketMessage(data)
                }

                // Store WebSocket instance
                this.ws = ws

                return this
            } catch (error) {
                this.error = 'Failed to initialize WebSocket connection'
            }
        },

        handleWebSocketMessage(data: any) {
            const router = useRouter();
            const roundStore = useRoundStore();
            switch (data.action) {
                case 'gameCreated':
                    this.gameId = data.gameId
                    this.playerId = data.playerId
                    this.players = data.players
                    break

                case 'playerListUpdated':
                    this.players = data.players
                    break

                case 'gameStarted':
                    this.currentLocationId = data.locationId
                    this.guesses = []

                    router.push('/multiplayer');

                    break

                case 'nextLocation':
                    this.currentLocationId = data.locationId;
                    this.guesses = []

                    if (roundStore.round === 5) {
                        roundStore.reset();
                        router.push(`/scoreboard/${this.gameId}`);
                    } else {
                        roundStore.nextRound();
                        router.push("/multiplayer");
                    }

                    break
                
                case 'roundComplete':
                    this.realLocation = data.realPosition
                    this.guesses = data.guesses || [];
                    break;

                case 'newGuess':
                    this.guesses.push(data.guess)
                    break

                case 'error':
                    this.error = data.message
                    break

                case 'joined':
                    this.gameId = data.gameId
                    this.playerId = data.playerId
                    this.players = data.players
                    break
            }
        },

        async createGame(username: string) {
            this.loading = true
            try {
                await this.ws?.send(JSON.stringify({
                    action: 'create',
                    username
                }))
            } catch (error) {
                this.error = 'Failed to create game'
            } finally {
                this.loading = false
            }
        },

        async getScores(gameId: string) {
            this.loading = true
            try {
                this.ws?.send(JSON.stringify({
                    action: 'getScores',
                    gameId,
                }))
            } catch (error) {
                this.error = 'Failed to get score'
            } finally {
                this.loading = false
            }
        },

        async joinGame(gameId: string, username: string) {
            this.loading = true
            try {
                this.ws?.send(JSON.stringify({
                    action: 'join',
                    gameId,
                    username
                }))
            } catch (error) {
                this.error = 'Failed to join game'
            } finally {
                this.loading = false
            }
        },

        startGame() {
            if (!this.gameId) return

            try {
                this.ws?.send(JSON.stringify({
                    action: 'start',
                    gameId: this.gameId
                }))
            } catch (error) {
                this.error = 'Failed to start game'
            }
        },

        submitGuess(latitude: number, longitude: number) {
            if (!this.gameId) return

            const guess: Guess = {
                playerId: this.playerId, // .find(p => p.id)?.id ?? '',
                latitude,
                longitude
            }

            try {
                this.ws?.send(JSON.stringify({
                    action: 'guess',
                    gameId: this.gameId,
                    playerId: this.playerId,
                    guess
                }))
            } catch (error) {
                this.error = 'Failed to submit guess'
            }
        },

        reset() {
            this.gameId = null
            this.players = []
            this.currentLocationId = null
            this.guesses = []
            this.error = null
        }
    }
})