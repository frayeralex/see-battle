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

  constructor(store, components) {
    this.components = components;
    this.store = store;
    this.store.subscribe(this.observeChanges.bind(this));

    this.store.setState({gameState: GameController.ATTACHED_SHIPS});

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
        console.log('Comp action');
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

  static shipsToCells(ships) {
    if (!Array.isArray(ships)) return [];

    return ships.reduce((cells, ship) => {
      return cells.concat(ship.coordinats.map(({x, y}) => ({x, y})));
    }, []);
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
    if (this.yourShips.cell1 !== 4) return false;
    if (this.yourShips.cell2 !== 3) return false;
    if (this.yourShips.cell3 !== 2) return false;
    return this.yourShips.cell4 === 1;
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