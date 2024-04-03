class WindowManager {
    constructor() {
        this.windows = [];
        this.count = 0;
        this.id = 0;
        this.winData = [];
        this.winShapeChangeCallback = null;
        this.winChangeCallback = null;

        window.addEventListener("storage", (event) => {
            if (event.key == "windows") {
                let newWindows = JSON.parse(event.newValue);
                let winChange = this.didWindowsChange(this.windows, newWindows);

                this.windows = newWindows;

                if (winChange) {
                    if (this.winChangeCallback) this.winChangeCallback();
                }
            }
        });

        window.addEventListener('beforeunload', (e) => {
            let index = this.getWindowIndexFromId(this.id);
            this.windows.splice(index, 1);
            this.updateWindowsLocalStorage();
        });
    }

    didWindowsChange(pWins, nWins) {
        if (pWins.length !== nWins.length) {
            return true;
        } else {
            let c = false;

            for (let i = 0; i < pWins.length; i++) {
                if (pWins[i].id !== nWins[i].id) c = true;
            }

            return c;
        }
    }

    init(metaData) {
        this.windows = JSON.parse(localStorage.getItem("windows")) || [];
        this.count = localStorage.getItem("count") || 0;
        this.count++;

        this.id = this.count;
        let shape = this.getWinShape();
        this.winData = { id: this.id, shape: shape, metaData: metaData };
        this.windows.push(this.winData);

        localStorage.setItem("count", this.count);
        this.updateWindowsLocalStorage();
    }

    getWinShape() {
        return { x: window.screenLeft, y: window.screenTop, w: window.innerWidth, h: window.innerHeight };
    }

    getWindowIndexFromId(id) {
        let index = -1;

        for (let i = 0; i < this.windows.length; i++) {
            if (this.windows[i].id === id) index = i;
        }

        return index;
    }

    updateWindowsLocalStorage() {
        localStorage.setItem("windows", JSON.stringify(this.windows));
    }

    update() {
        let winShape = this.getWinShape();

        if (winShape.x !== this.winData.shape.x ||
            winShape.y !== this.winData.shape.y ||
            winShape.w !== this.winData.shape.w ||
            winShape.h !== this.winData.shape.h) {
            this.winData.shape = winShape;

            let index = this.getWindowIndexFromId(this.id);
            this.windows[index].shape = winShape;

            if (this.winShapeChangeCallback) this.winShapeChangeCallback();
            this.updateWindowsLocalStorage();
        }
    }

    setWinShapeChangeCallback(callback) {
        this.winShapeChangeCallback = callback;
    }

    setWinChangeCallback(callback) {
        this.winChangeCallback = callback;
    }

    getWindows() {
        return this.windows;
    }

    getThisWindowData() {
        return this.winData;
    }

    getThisWindowID() {
        return this.id;
    }
}

export default WindowManager;
