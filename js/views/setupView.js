// js/views/setupView.js

const setupView = {

    handleNameEdit: function (event) {
        const playerNameEl = event.currentTarget;
        const slot = playerNameEl.dataset.slot;
        const currentName = playerNameEl.textContent.trim();

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'player-name-edit';
        inputField.value = currentName;
        inputField.maxLength = 15;

        playerNameEl.replaceWith(inputField);
        inputField.focus();

        const finalizeEdit = () => {
            let newName = inputField.value.trim() || `Player ${slot}`;

            const playerIndex = App.gameConfig.players.findIndex(p => p.id == slot);
            if (playerIndex !== -1) {
                App.gameConfig.players[playerIndex].name = newName;
            }

            const newSpan = document.createElement('span');
            newSpan.className = 'player-name';
            newSpan.textContent = newName;
            newSpan.dataset.slot = slot;
            newSpan.addEventListener('click', setupView.handleNameEdit);

            inputField.replaceWith(newSpan);

            document.querySelector(`.player-slot:nth-child(${slot}) .player-avatar`).textContent = newName.charAt(0).toUpperCase();
        };

        inputField.addEventListener('blur', finalizeEdit);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finalizeEdit();
            }
        });
    },

    render: function (container) {
        const player1 = App.gameConfig.players[0];
        const player2 = App.gameConfig.players[1];

        container.innerHTML = `
            <div class="view-content lobby-content">
                <h2 class="view-title">Ustawienia Gry (2 Osoby)</h2>
                
                <div class="player-list">
                    <div class="player-slot active">
                        <span class="player-avatar">${player1.name.charAt(0).toUpperCase()}</span>
                        <span class="player-name" data-slot="${player1.id}">${player1.name}</span>
                    </div>
                    <div class="player-slot active">
                        <span class="player-avatar">${player2.name.charAt(0).toUpperCase()}</span>
                        <span class="player-name" data-slot="${player2.id}">${player2.name}</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" id="start-game-btn">ROZPOCZNIJ GRĘ</button>
            </div>
        `;
        this.addEventListeners();

        document.querySelectorAll('.player-name').forEach(nameEl => {
            nameEl.addEventListener('click', this.handleNameEdit);
        });
    },

    addEventListeners: function () {
        document.getElementById('start-game-btn').addEventListener('click', () => {
            App.navigateToGame();
        });
    }
};