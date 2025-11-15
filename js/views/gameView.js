// js/views/gameView.js

const gameView = {
    spectrumEl: null, spectrumRightEl: null, instructionsEl: null, clueDisplayEl: null,
    psychicControls: null, guesserControls: null, revealControls: null,
    scoreBoardEl: null, playerScore1El: null, playerScore2El: null,

    render: function (container) {
        container.innerHTML = `
            <div class="view-content">
                <div class="score-board" id="score-board">
                    <div class="player-score-box" id="player-score-1">
                        <span class="player-role-name">Nati</span>: <span class="score-value">0</span> pkt
                    </div>
                    <div class="player-score-box" id="player-score-2">
                        <span class="player-role-name">Kris</span>: <span class="score-value">0</span> pkt
                    </div>
                </div>
                
                <div class="game-status-box">
                    <p id="game-instructions">Instrukcje</p>
                    <p class="clue-display" id="clue-display-area"></p>
                </div>

                <div class="dial-container" id="main-dial-container">
                    <div id="dial-pointer"></div>
                </div>

                <div class="spectrum-labels-wrapper">
                    <span class="spectrum-word-left" id="spectrum-left">LEWA</span>
                    <span class="spectrum-word-right" id="spectrum-right">PRAWA</span>
                </div>

                <div class="game-controls">
                    <div id="psychic-controls">
                        <button class="btn btn-primary" id="start-guessing-btn">PODAJ USTNĄ PODPOWIEDŹ</button>
                    </div>
                    
                    <div id="guesser-controls" class="hidden">
                        <button class="btn btn-primary" id="submit-guess-btn">ZGADŁEM! ODKRYJ CEL</button>
                    </div>
                    
                    <div id="reveal-controls" class="hidden">
                         <button class="btn btn-primary" id="next-round-btn">NASTĘPNA RUNDA</button>
                         <button class="btn btn-secondary" id="exit-game-btn">WRÓĆ DO MENU</button>
                    </div>

                    <div id="show-hide-segments">
                        <button class="btn btn-primary" id="show-hide-segments-btn">POKAŻ / UKRYJ SEGMENTY</button>
                    </div>
                </div>
            </div>
        `;

        Dial.init('main-dial-container');

        this.getReferences();
        this.addEventListeners();
        this.updateDisplay();
    },

    getReferences: function () {
        this.spectrumEl = document.getElementById('spectrum-left');
        this.spectrumRightEl = document.getElementById('spectrum-right');
        this.instructionsEl = document.getElementById('game-instructions');
        this.clueDisplayEl = document.getElementById('clue-display-area');
        this.psychicControls = document.getElementById('psychic-controls');
        this.guesserControls = document.getElementById('guesser-controls');

        this.scoreBoardEl = document.getElementById('score-board');
        this.playerScore1El = document.getElementById('player-score-1');
        this.playerScore2El = document.getElementById('player-score-2');
        this.revealControls = document.getElementById('reveal-controls');
    },

    addEventListeners: function () {
        document.getElementById('start-guessing-btn').addEventListener('click', () => {
            Game.submitClue("USTNIE");
        });

        document.getElementById('submit-guess-btn').addEventListener('click', () => {
            Game.submitGuess(Game.currentPointerAngle);
        });

        document.getElementById('next-round-btn').addEventListener('click', () => {
            Game.startNewRound();
        });

        document.getElementById('exit-game-btn').addEventListener('click', () => {
            Game.backToSetup();
        });

        document.getElementById('show-hide-segments-btn').addEventListener('click', () => {
            const visible = Dial.targetSegments[0].style.opacity == 0;
            Dial.setTargetVisibility(!!visible);
        });
    },

    updateRevealDisplay: function (points) {
        const psychic = App.gameConfig.players.find(p => p.id === Game.currentPsychicId);

        Dial.setTargetVisibility(true);

        this.guesserControls.classList.add('hidden');
        this.psychicControls.classList.add('hidden');
        this.revealControls.classList.remove('hidden');

        this.instructionsEl.textContent = `KONIEC RUNDY! Zgadnięto: ${points} pkt.`;
        this.clueDisplayEl.textContent = `${psychic.name} zdobywa ${points} punktów!`;

        this.updateScoreBoard(Game.currentPsychicId);
    },

    updateDisplay: function () {
        const players = App.gameConfig.players;
        const psychic = players.find(p => p.id === Game.currentPsychicId);
        const guesser = players.find(p => p.id !== Game.currentPsychicId);

        this.updateScoreBoard(psychic.id);

        this.spectrumEl.textContent = Game.currentSpectrum ? Game.currentSpectrum[0] : 'LEWA';
        this.spectrumRightEl.textContent = Game.currentSpectrum ? Game.currentSpectrum[1] : 'PRAWA';

        if (Game.gameState === 'PSYCHIC_CLUE') {
            this.instructionsEl.textContent = `Runda ${Game.roundCounter}: ${psychic.name}, podaj podpowiedź ustnie. (Widzisz Cel)`;
            this.clueDisplayEl.textContent = 'Kliknij "Podaj ustną podpowiedź" po jej udzieleniu.';

            this.psychicControls.classList.remove('hidden');
            this.guesserControls.classList.add('hidden');
            this.revealControls.classList.add('hidden');

            Dial.setTarget(Game.currentTargetAngle);
            Dial.setTargetVisibility(false);
            Dial.updatePointer(0);
        }
        else if (Game.gameState === 'GUESSING') {
            this.instructionsEl.textContent = `Runda ${Game.roundCounter}: ${guesser.name}, ustaw wskaźnik. (Cel ukryty)`;
            this.clueDisplayEl.textContent = `Podpowiedź od ${psychic.name}.`;

            this.psychicControls.classList.add('hidden');
            this.guesserControls.classList.remove('hidden');
            this.revealControls.classList.add('hidden');

            Dial.setTargetVisibility(false);
        }
    },

    updateScoreBoard: function (psychicId) {
        const p1 = App.gameConfig.players[0];
        const p2 = App.gameConfig.players[1];

        this.playerScore1El.querySelector('.score-value').textContent = p1.score;
        this.playerScore2El.querySelector('.score-value').textContent = p2.score;

        if (p1.id === psychicId) {
            this.playerScore1El.classList.add('psychic');
            this.playerScore1El.classList.remove('guesser');
            this.playerScore2El.classList.remove('psychic');
            this.playerScore2El.classList.add('guesser');
            this.playerScore1El.querySelector('.player-role-name').textContent = `${p1.name}`;
            this.playerScore2El.querySelector('.player-role-name').textContent = `${p2.name}`;
        } else {
            this.playerScore2El.classList.add('psychic');
            this.playerScore2El.classList.remove('guesser');
            this.playerScore1El.classList.remove('psychic');
            this.playerScore1El.classList.add('guesser');
            this.playerScore2El.querySelector('.player-role-name').textContent = `${p2.name}`;
            this.playerScore1El.querySelector('.player-role-name').textContent = `${p1.name}`;
        }
    }
};