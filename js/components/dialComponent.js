// js/components/dialComponent.js

const Dial = {
    dialContainer: null,
    pointerEl: null,
    targetSegments: [],
    isDragging: false,

    init: function (containerId) {
        this.dialContainer = document.getElementById(containerId);
        this.pointerEl = document.getElementById('dial-pointer');

        this.initDynamicSegments();
        this.updatePointer(Game.currentPointerAngle);
        this.addEventListeners();
    },

    initDynamicSegments: function () {
        this.targetSegments = [];
        this.dialContainer.innerHTML = '';

        const segmentClasses = ['score-2', 'score-3', 'score-4', 'score-3', 'score-2'];
        const segmentScores = [2, 3, 4, 3, 2];
        const segmentOffsets = [-20, -10, 0, 10, 20];

        segmentClasses.forEach((cls, i) => {
            const segment = document.createElement('div');
            segment.classList.add('target-segment', cls);
            segment.dataset.offset = segmentOffsets[i];

            const scoreLabel = document.createElement('span');
            scoreLabel.classList.add('score-label');
            scoreLabel.textContent = segmentScores[i];

            const labelRotation = -segmentOffsets[i];
            scoreLabel.style.transform = `translateX(-50%) rotate(${labelRotation}deg)`;

            segment.appendChild(scoreLabel);

            this.dialContainer.prepend(segment);
            this.targetSegments.push(segment);
        });

        this.dialContainer.appendChild(this.pointerEl);
    },

    addEventListeners: function () {
        const startDrag = (e) => {
            if (Game.gameState === 'GUESSING') {
                this.isDragging = true;
                this.updatePointerPosition(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
            }
        };
        const stopDrag = () => {
            this.isDragging = false;
        };
        const movePointer = (e) => {
            if (this.isDragging) {
                if (e.type.startsWith('touch')) e.preventDefault();
                this.updatePointerPosition(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
            }
        };

        this.dialContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('mousemove', movePointer);

        this.dialContainer.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
        document.addEventListener('touchmove', movePointer, { passive: false });
    },

    setTarget: function (centerAngle) {
        const baseRotation = centerAngle - 90;

        this.targetSegments.forEach(segment => {
            const offset = parseFloat(segment.dataset.offset);
            const finalRotation = baseRotation + offset;

            segment.style.transform = `translateX(-50%) translateY(-190px) rotate(${finalRotation}deg)`;

            const scoreLabel = segment.querySelector('.score-label');
            if (scoreLabel) {
                scoreLabel.style.transform = `rotate(${-finalRotation}deg)`;
            }
        });
    },

    setTargetVisibility: function (visible) {
        this.targetSegments.forEach(segment => {
            segment.style.opacity = visible ? '1' : '0';
        });
    },

    updatePointer: function (angle) {
        Game.currentPointerAngle = Math.max(-90, Math.min(90, angle));
        this.pointerEl.style.transform = `rotate(${Game.currentPointerAngle}deg)`;
    },

    updatePointerPosition: function (x, y) {
        const rect = this.dialContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.bottom;

        const deltaX = centerX - x;
        const deltaY = centerY - y;

        let angleRad = Math.atan2(deltaY, deltaX);
        let angleDeg = angleRad * (180 / Math.PI);

        let finalAngle;

        if (deltaY < 0) {
            return;
        }

        if (angleDeg >= 0) {
            finalAngle = angleDeg - 90;
        } else {
            finalAngle = angleDeg + 90;
        }

        this.updatePointer(finalAngle);
    }
};