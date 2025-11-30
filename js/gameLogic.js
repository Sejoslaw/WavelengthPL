// js/gameLogic.js

const Game = {
    roundCounter: 0,
    currentSpectrum: null,
    currentTargetAngle: 0,
    currentClue: '',
    currentPointerAngle: 0,
    gameState: CONSTANTS.State.Idle,
    currentPsychicId: 1,

    startNewGame: function () {
        App.gameConfig.players.forEach(p => p.score = 0);
        this.roundCounter = 0;

        this.currentPsychicId = App.gameConfig.players[1].id;

        this.gameState = CONSTANTS.State.PsychicClue;
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
        this.currentClue = CONSTANTS.Clue.Ustnie;
        this.gameState = CONSTANTS.State.PsychicClue;

        Dial.updatePointer(0);

        gameView.updateDisplay();
    },

    submitClue: function (clue) {
        if (this.gameState !== CONSTANTS.State.PsychicClue) return;
        this.currentClue = clue.trim();

        this.gameState = CONSTANTS.State.Guessing;
        gameView.updateDisplay();
    },

    submitGuess: function (pointerAngle) {
        if (this.gameState !== CONSTANTS.State.Guessing) return;

        const points = this.calculateScore(this.currentTargetAngle, pointerAngle);

        const psychic = App.gameConfig.players.find(p => p.id === this.currentPsychicId);
        if (psychic) {
            psychic.score += points;
        }

        this.gameState = CONSTANTS.State.Reveal;

        gameView.updateRevealDisplay(points);
    },

    backToSetup: function () {
        this.gameState = CONSTANTS.State.Idle;
        App.navigateToSetup();
    },

    getRandomTargetAngle: function () {
        return Math.random() * 135 + 22.5;
    },

    calculateScore: function (targetCenterAngle, pointerAngle) {
        targetCenterAngle = Math.floor(targetCenterAngle);
        pointerAngle = Math.floor(pointerAngle);

        pointerAngle += 90;
        
        const diff = Math.abs(targetCenterAngle - pointerAngle);

        if (diff <= 2) return 4;
        if (diff <= 9) return 3;
        if (diff <= 16) return 2;
        return 0;
    }
};