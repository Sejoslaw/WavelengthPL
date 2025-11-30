// js/main.js

const App = {
    views: {
        setup: document.getElementById(CONSTANTS.View.Setup),
        game: document.getElementById(CONSTANTS.View.Game),
    },

    currentView: null,

    init: function () {
        setupView.render(this.views.setup);
        gameView.render(this.views.game);

        this.showView('setup');
    },

    showView: function (viewName) {
        if (!this.views[viewName]) {
            console.error(`View ${viewName} not found.`);
            return;
        }

        for (let key in this.views) {
            this.views[key].classList.add(CONSTANTS.Class.Hidden);
        }

        this.views[viewName].classList.remove(CONSTANTS.Class.Hidden);
        this.currentView = viewName;
    },

    navigateToSetup: function () {
        App.showView('setup');
    },

    navigateToGame: function () {
        App.showView('game'); 
        Game.startNewGame();
    },

    gameConfig: {
        players: [
            { id: 1, name: "Nati", score: 0 },
            { id: 2, name: "Kris", score: 0 }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});