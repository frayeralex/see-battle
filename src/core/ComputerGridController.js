import Grid from '../components/grid/Grid';
import Store from '../store/Store';
import GameController from './GameController';


class ComputerGridController {
  static init() {
    return new this(...arguments);
  }

  constructor(gridView, store) {
    if (!(gridView instanceof Grid)) throw new Error('Grid is require');
    if (!(store instanceof Store)) throw new Error('Store is require');
    this.grid = gridView;
    this.store = store;

    this.grid.addEventHandler(Grid.EVENT_CELL_CLICKED, this.onCellClicked.bind(this));
    this.attemptRequest = false;
  }

  get compShips() {
    return this.store.state.compShips;
  }

  get gameState() {
    return this.store.state.gameState;
  }

  get attempts() {
    return this.store.state.attempts;
  }

  get userMissCells() {
    return this.store.state.userMissCells || [];
  }

  get userHitCells() {
    return this.store.state.userHitCells || [];
  }

  onCellClicked({position}) {
    if (this.attemptRequest) return;
    if (this.gameState !== GameController.USER_ACTION) return;

    this.attemptRequest = true;
    setTimeout(() => {
      this.userAttempt(position);
      this.attemptRequest = false;
    }, GameController.randomNumber(1500));
  }

  userAttempt({x, y}) {
    if (this.gameState !== GameController.USER_ACTION) return;
    if (this.userHitCells.find(({x: X, y: Y}) => x === X && y === Y)) return;
    if (this.userMissCells.find(({x: X, y: Y}) => x === X && y === Y)) return;

    const damagedShip = this.compShips.find(ship => ship.isInCoordinates(x ,y));
    const all = this.attempts.all + 1;
    let cellAroundShip = [];
    if (damagedShip) {
      damagedShip.setDamage(x, y);
      if (damagedShip.isKilled()) {
        cellAroundShip = damagedShip.nearestCells.map(([x,y]) => ({x, y}));
      }
      const success = this.attempts.success + 1;
      return this.store.setState({
        userMissCells: [...this.userMissCells, ...cellAroundShip],
        userHitCells: [...this.userHitCells, {x, y}],
        attempts: {all, success},
        compShips: [...this.compShips],
        gameState: GameController.USER_ACTION
      });
    }

    this.store.setState({
      userMissCells: [...this.userMissCells, {x, y}],
      attempts: {...this.attempts, ...{ all }},
      gameState: GameController.COMP_ACTION
    });
  }
}

export default ComputerGridController;