// js/views/setupView.js

const setupView = {

    handleNameEdit: function (event) {
        const playerNameEl = event.currentTarget;
        const slot = playerNameEl.dataset.slot;
        const currentName = playerNameEl.textContent.trim();

        const inputField = document.createElement(CONSTANTS.Element.Input);
        inputField.type = CONSTANTS.ElementType.Text;
        inputField.className = CONSTANTS.Class.PlayerNameEdit;
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

            const newSpan = document.createElement(CONSTANTS.Element.Span);
            newSpan.className = CONSTANTS.Class.PlayerName;
            newSpan.textContent = newName;
            newSpan.dataset.slot = slot;
            newSpan.addEventListener(CONSTANTS.EventListener.Click, setupView.handleNameEdit);

            inputField.replaceWith(newSpan);
        };

        inputField.addEventListener(CONSTANTS.EventListener.Blur, finalizeEdit);
        inputField.addEventListener(CONSTANTS.EventListener.KeyPress, (e) => {
            if (e.key === CONSTANTS.Key.Enter) {
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
                        <span class="player-name" data-slot="${player1.id}">${player1.name}</span>
                    </div>
                    <div class="player-slot active">
                        <span class="player-name" data-slot="${player2.id}">${player2.name}</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" id="start-game-btn">ROZPOCZNIJ GRĘ</button>
            </div>
        `;
        this.addEventListeners();

        document.querySelectorAll(`.${CONSTANTS.Class.PlayerName}`).forEach(nameEl => {
            nameEl.addEventListener('click', this.handleNameEdit);
        });
    },

    addEventListeners: function () {
        document.getElementById('start-game-btn').addEventListener(CONSTANTS.EventListener.Click, () => {
            App.navigateToGame();
        });
    }
};