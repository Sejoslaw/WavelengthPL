class RandomPicker {
    constructor(initialItems) {
        this.initialItems = initialItems;
        this.workingCopy = this._createCopy();
    }

    pickRandom() {
        if (this.workingCopy.length === 0) {
            this.workingCopy = this._createCopy();
        }

        if (this.workingCopy.length === 0) { // if the initialItems is also empty
            return null;
        }

        const randomIndex = Math.floor(Math.random() * this.workingCopy.length);
        const pickedValue = this.workingCopy[randomIndex];

        this.workingCopy.splice(randomIndex, 1);

        return pickedValue;
    }

    _createCopy() {
        return structuredClone(this.initialItems);
    }
}