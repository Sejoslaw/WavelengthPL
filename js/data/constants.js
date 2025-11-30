// js/data/constants.js

const CONSTANTS = {
    View: {
        Setup: 'setup-view',
        Game: 'game-view'
    },
    Element: {
        Input: 'input',
        Span: 'span',
    },
    ElementType: {
        Text: 'text'
    },
    Class: {
        Hidden: 'hidden',
        PlayerName: 'player-name',
        PlayerNameEdit: 'player-name-edit'
    },
    State: {
        Idle: 'IDLE',
        PsychicClue: 'PSYCHIC_CLUE',
        Guessing: 'GUESSING',
        Reveal: 'REVEAL',
        GameOver: 'GAME_OVER'
    },
    Clue: {
        Ustnie: 'USTNIE'
    },
    EventListener: {
        Click: 'click',
        Blur: 'blur',
        KeyPress: 'keypress'
    },
    Key: {
        Enter: 'Enter'
    }
};

const SEGMENT_CLASSES = ['score-2', 'score-3', 'score-4', 'score-3', 'score-2'];
const SEGMENT_SCORES = [2, 3, 4, 3, 2];
const SEGMENT_OFFSETS = [-12, -6, 0, 6, 12];