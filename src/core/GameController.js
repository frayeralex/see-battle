
class GameController {
    static observe(store) {
        return new this(store);
    }

    constructor(store) {
        this.store = store;
        this.store.subscribe(this.observeChanges.bind(this));

        this.gameState = GameController.ATTACHED_SHIPS;
        this.store.setState({gameState: this.gameState});

        this.yourShips = {
            cell4: 0,
            cell3: 0,
            cell2: 0,
            cell1: 0
        }
    }

    observeChanges(props = {}) {
        Object.keys(props)
            .forEach((key) => {
                if (this[`${key}Observe`]) {
                    this[`${key}Observe`](props[key]);
                }
            });
    }

    shipsObserve(ships) {
        const { start } = this.store.state.controls;
        this.resetShips();

        ships.forEach(ship => {
            this.yourShips[`cell${ship.type}`] += 1;
        });
        if (start.disabled && this.isReadyToStart) {
            this.activateStartButton();
        }
        if (!start.disabled && !this.isReadyToStart) {
            this.disactivateStartButton();
        }
    }

    resetShips(){
        Object.keys(this.yourShips)
            .forEach((key) => this.yourShips[key] = 0);
    }

    get isReadyToStart(){
        if (this.yourShips.cell1 !== 4) return false;
        if (this.yourShips.cell2 !== 3) return false;
        if (this.yourShips.cell3 !== 2) return false;
        if (this.yourShips.cell4 !== 1) return false;
        return true;
    }

    controlsObserve(controls) {
        console.log('observe cells', controls);
    }

    /**
     * Activate control start button
     */
    activateStartButton() {
        this.store.setState({controls: {
            ...this.store.state.controls,
            ...{start: {
                label: 'Start',
                disabled: false
            }}
        }});
    }

    /**
     * Disactivate control start button
     */
    disactivateStartButton() {
        this.store.setState({controls: {
            ...this.store.state.controls,
            ...{start: {
                label: 'Start',
                disabled: true
            }}
        }});
    }
}

GameController.ATTACHED_SHIPS = 'attachedShips';
GameController.ATTACHED_COPM_SHIPS = 'attachedComputerShips';
GameController.USER_ACTION = 'userAction';
GameController.COMP_ACTION = 'compAction';
GameController.END_GAME = 'endGame';

export default GameController;