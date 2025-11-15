// js/gameLogic.js

const Game = {
    roundCounter: 0,
    currentSpectrum: null,
    currentTargetAngle: 0,
    currentClue: '',
    currentPointerAngle: 0,
    gameState: 'IDLE', // IDLE, PSYCHIC_CLUE, GUESSING, REVEAL, GAME_OVER

    currentPsychicId: 1,

    startNewGame: function () {
        App.gameConfig.players.forEach(p => p.score = 0);
        this.roundCounter = 0;

        this.currentPsychicId = App.gameConfig.players[1].id;

        this.gameState = 'PSYCHIC_CLUE';
        this.startNewRound();
    },

    startNewRound: function () {
        this.roundCounter++;

        const p1Id = App.gameConfig.players[0].id;
        const p2Id = App.gameConfig.players[1].id;

        if (this.currentPsychicId === p1Id) {
            this.currentPsychicId = p2Id;
        } else {
            this.currentPsychicId = p1Id;
        }

        this.currentSpectrum = getRandomSpectrum();
        this.currentTargetAngle = this.getRandomTargetAngle();
        this.currentClue = 'USTNIE';
        this.gameState = 'PSYCHIC_CLUE';

        Dial.updatePointer(0);

        gameView.updateDisplay();
    },

    submitClue: function (clue) {
        if (this.gameState !== 'PSYCHIC_CLUE') return;
        this.currentClue = clue.trim();

        this.gameState = 'GUESSING';
        gameView.updateDisplay();
    },

    submitGuess: function (pointerAngle) {
        if (this.gameState !== 'GUESSING') return;

        const points = this.calculateScore(this.currentTargetAngle, pointerAngle);

        const psychic = App.gameConfig.players.find(p => p.id === this.currentPsychicId);
        if (psychic) {
            psychic.score += points;
        }

        this.gameState = 'REVEAL';

        gameView.updateRevealDisplay(points);
    },

    backToSetup: function () {
        this.gameState = 'IDLE';
        App.navigateToSetup();
    },

    getRandomTargetAngle: function () {
        return Math.random() * 135 + 22.5;
    },

    calculateScore: function (targetCenterAngle, pointerAngle) {
        const diff = Math.abs(targetCenterAngle - pointerAngle);

        if (diff <= 15) return 4;
        if (diff <= 30) return 3;
        if (diff <= 45) return 2;
        return 0;
    }
};