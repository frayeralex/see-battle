
import Ship from "../models/Ship";

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

    gameStateObserve(state) {
        switch (state) {
            case GameController.ATTACHED_COPM_SHIPS:
                this.setRandomPositions();
            default:
                return null;
        }
    }

    setRandomPositions() {
        const randomPosition = () => {
            const x = Math.floor((Math.random() * 11));
            const y = Math.floor((Math.random() * 11));
            return {x ,y};
        };
        const compShips = [];
        const position = randomPosition();
        const cell4 = Ship.create(position.x, position.y);

        let dynamicPosition;
        while (cell4.type < 4) {
            dynamicPosition = randomPosition();
            cell4.merge(dynamicPosition.x, dynamicPosition.y);
        }

        compShips.push(cell4);

        function createShip(type) {
            let position = randomPosition();
            while (compShips.every(ship => ship.isNotNearest(position.x, position.y))){
                position = randomPosition();
            }
            const ship = Ship.create(position.x, position.y);
            while (ship.type < type) {
                dynamicPosition = randomPosition();
                ship.merge(dynamicPosition.x, dynamicPosition.y)
            }
            return ship;
        }

        for (let i = 0; i < 2; i++) {
            let cell3 = createShip(3);
            while (compShips.some(ship => !ship.isShipNearest(cell3))) {
                cell3 = createShip(3);
            }
            compShips.push(cell3);
        }

        for (let i = 0; i < 3; i++) {
            let cell2 = createShip(2);
            while (compShips.some(ship => !ship.isShipNearest(cell2))) {
                cell2 = createShip(2);
            }
            compShips.push(cell2);
        }

        for (let i = 0; i < 4; i++) {
            let cell1 = createShip(1);
            while (compShips.some(ship => !ship.isShipNearest(cell1))) {
                cell1 = createShip(1);
            }
            compShips.push(cell1);
        }

        this.store.setState({
            cells: compShips.reduce((arr, ship) => {
                return arr.concat(ship.coordinats.map(item => ({x: item.x, y: item.y})));
            }, [])
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