import Ship from '../models/Ship';


class GameController {
  static bootstrap(store, config) {
    const components = GameController.initComponents(config.components, store);
    return new this(store, components);
  }

  static randomNumber(max){
    return Math.floor(Math.random() * (max + 1));
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

  static shipsToCells(ships) {
    if (!Array.isArray(ships)) return [];

    return ships.reduce((cells, ship) => {
      return cells.concat(ship.coordinats.map(({x, y}) => ({x, y})));
    }, []);
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

    this.yourShips = {
      cell4: 0,
      cell3: 0,
      cell2: 0,
      cell1: 0
    };
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
        console.log('User action');
        break;
      case GameController.COMP_ACTION:
        setTimeout(() => {
          this.runCompAction();
        }, (GameController.randomNumber(3) + 1) * 1000);
        break;
      case GameController.END_GAME:
        console.log('end game');
      default:
        return null;
    }
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
    let compShips = [];
    let emptyCells = GameController.generateGridCoordinates();

    try {
      const randomNumber = (max) => {
        return Math.floor(Math.random() * (max + 1));
      };

      const createShip = (type) => {
        const position = emptyCells[randomNumber(emptyCells.length - 1)];
        const ship = Ship.create(position.x, position.y);
        while (ship.type < type) {
          const [xx, yy] = ship.relativeCells[randomNumber(ship.relativeCells.length - 1)];
          const {x, y} = emptyCells.find(item => item.x === xx && item.y === yy);
          ship.merge(x, y);
        }
        return ship;
      };

      for (let type = 4; type >= 1; type--) {
        for (let count = 1; count <= 5 - type; count++) {
          const newShip = createShip(type);
          emptyCells = emptyCells.filter(item => {
            return !newShip.isNearest(item.x, item.y) && !newShip.isInCoordinates(item.x, item.y);
          });
          compShips.push(newShip);
        }
      }
    } catch (err) {
      return this.createRandomShips();
    }
    return compShips;
  }

  runCompAction() {
    const {x, y} = this.compCanHitCells[GameController.randomNumber(this.compCanHitCells.length -1)];
    const damagedShip = this.ships.find(ship => ship.isInCoordinates(x ,y));
    let compCanHitCells = this.compCanHitCells.filter((item) => item.x !== x && item.y !== y);
    let cellAroundShip = [];
    if (damagedShip) {
      damagedShip.setDamage(x, y);
      if (damagedShip.isKilled()) {
        cellAroundShip = damagedShip.nearestCells.map(([x,y]) => ({x, y}));
        compCanHitCells = compCanHitCells.filter(({x, y}) => !cellAroundShip.some((cell) => cell.x === x && cell.y === y));
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

  resetShips() {
    Object.keys(this.yourShips)
      .forEach((key) => this.yourShips[key] = 0);
  }

  get isReadyToStart() {
    for (let type = 1; type <= 4; type++) {
      if (this.yourShips[`cell${type}`] !== 5 - type) return false;
    }
    return true;
  }

  controlsObserve(controls) {
    console.log('observe cells', controls);
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