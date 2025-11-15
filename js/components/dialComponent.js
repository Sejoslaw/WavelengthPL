// js/components/dialComponent.js

const Dial = {
    dialContainer: null,
    pointerEl: null,
    targetAreaEl: null,
    isDragging: false,

    init: function (containerId) {
        this.dialContainer = document.getElementById(containerId);

        this.pointerEl = document.getElementById('dial-pointer');
        this.targetAreaEl = document.getElementById('target-area');

        this.updatePointer(Game.currentPointerAngle);
        this.addEventListeners();
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
        const rotationAdjustment = centerAngle - 90;
        this.targetAreaEl.style.transform = `translateX(-50%) rotate(${rotationAdjustment}deg)`;
    },

    setTargetVisibility: function (visible) {
        this.targetAreaEl.style.opacity = visible ? '1' : '0';
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