import Ship from '../models/Ship';


class GameController {
  static bootstrap(store, config) {
    const components = GameController.initComponents(config.components, store);
    return new this(store, components);
  }

  static initComponents(components, store) {
    return components.map(({selector, view, controller}) => {
      const node = document.querySelector(selector);
      const componentView = view.init(node, store);
      if (controller) {
        controller.init(componentView, store);
      }
      return {node, componentView, controller};
    });
  }

  static randomNumber(max){
    return Math.floor(Math.random() * (max + 1));
  }

  static shipsToCells(ships) {
    if (!Array.isArray(ships)) return [];

    return ships.reduce((cells, ship) => {
      return cells.concat(ship.coordinats.map(({x, y}) => ({x, y})));
    }, []);
  }

  static generateGridCoordinates(X = 10, Y = 10) {
    const coordinates = [];
    for (let x = 1; x <= X; x++) {
      for (let y = 1; y <= Y; y++) {
        coordinates.push({x, y});
      }
    }
    return coordinates;
  }

  static createRandomShips() {
    const compShips = [];
    let emptyCells = GameController.generateGridCoordinates();

    try {
      const createShip = (type) => {
        const {x ,y} = emptyCells[GameController.randomNumber(emptyCells.length - 1)];
        const ship = Ship.create(x, y);
        while (ship.type < type) {
          const [X, Y] = ship.relativeCells[GameController.randomNumber(ship.relativeCells.length - 1)];
          const {x, y} = emptyCells.find(item => item.x === X && item.y === Y);
          ship.merge(x, y);
        }
        return ship;
      };

      for (let type = 4; type >= 1; type--) {
        for (let count = 1; count <= 5 - type; count++) {
          const newShip = createShip(type);
          emptyCells = emptyCells.filter(({x, y}) => {
            return !newShip.isNearest(x, y) && !newShip.isInCoordinates(x, y);
          });
          compShips.push(newShip);
        }
      }
    } catch (err) {
      return this.createRandomShips();
    }
    return compShips;
  }

  constructor(store, components) {
    this.components = components;
    this.store = store;
    this.store.subscribe(this.observeChanges.bind(this));

    this.store.setDefaultState({
      gameState: GameController.ATTACHED_SHIPS,
      compMissCells: [],
      compHitCells: [],
      compCanHitCells: GameController.generateGridCoordinates()
    });
  }

  get gameState() {
    return this.store.state.gameState;
  }

  get ships() {
    return this.store.state.ships;
  }

  get compMissCells() {
    return this.store.state.compMissCells;
  }

  get compHitCells() {
    return this.store.state.compHitCells;
  }

  get compCanHitCells() {
    return this.store.state.compCanHitCells;
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
        this.store.setState({
          compShips: GameController.createRandomShips(),
          gameState: GameController.USER_ACTION
        });
        break;
      case GameController.USER_ACTION:
        break;
      case GameController.COMP_ACTION:
        this.runCompAction();
        break;
      case GameController.END_GAME:

      default:
        return null;
    }
  }

  runCompAction() {
    const {x, y} = this.compCanHitCells[GameController.randomNumber(this.compCanHitCells.length -1)];
    const damagedShip = this.ships.find(ship => ship.isInCoordinates(x ,y));
    let compCanHitCells = this.compCanHitCells.filter((item) => !(item.x === x && item.y === y));
    let cellAroundShip = [];
    if (damagedShip) {
      damagedShip.setDamage(x, y);
      if (damagedShip.isKilled()) {
        cellAroundShip = damagedShip.nearestCells
          .map(([x,y]) => ({x, y}));

        compCanHitCells = compCanHitCells
          .filter((canHitCells) => !cellAroundShip
            .find((cell) => cell.x === canHitCells.x && cell.y === canHitCells.y));
      }
      return this.store.setState({
        compMissCells: [...this.compMissCells, ...cellAroundShip],
        compHitCells: [...this.compHitCells, {x, y}],
        ships: [...this.ships],
        compCanHitCells,
        gameState: GameController.COMP_ACTION
      });
    }

    return this.store.setState({
      compMissCells: [...this.compMissCells, {x, y}],
      ships: [...this.ships],
      compCanHitCells,
      gameState: GameController.USER_ACTION
    });
  }

  shipsObserve(ships) {
    const {start} = this.store.state.controls;

    if (start.disabled && this.isReadyToStart) {
      this.activateStartButton();
    }
    if (!start.disabled && !this.isReadyToStart) {
      this.disactivateStartButton();
    }
  }

  get isReadyToStart() {
    const ships = this.ships.reduce((ships, ship) => {
      ships[ship.type] ? ships[ship.type] += 1 : ships[ship.type] = 1;
      return ships;
    }, {});

    for (let type = 1; type <= 4; type++) {
      if (!ships[type]) return false;
      if (ships[type] !== 5 - type) return false;
    }
    return true;
  }

  /**
   * Activate control start button
   */
  activateStartButton() {
    this.store.setState({
      controls: {
        ...this.store.state.controls,
        ...{
          start: {
            label: 'Start',
            disabled: false
          }
        }
      }
    });
  }

  /**
   * Disactivate control start button
   */
  disactivateStartButton() {
    this.store.setState({
      controls: {
        ...this.store.state.controls,
        ...{
          start: {
            label: 'Start',
            disabled: true
          }
        }
      }
    });
  }
}

GameController.ATTACHED_SHIPS = 'attachedShips';
GameController.ATTACHED_COPM_SHIPS = 'attachedComputerShips';
GameController.USER_ACTION = 'userAction';
GameController.COMP_ACTION = 'compAction';
GameController.END_GAME = 'endGame';

export default GameController;