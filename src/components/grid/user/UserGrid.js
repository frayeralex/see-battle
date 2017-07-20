import Grid from '../Grid';
import GameController from '../../../core/GameController';


class UserGrid extends Grid {
  static init() {
    return new this(...arguments);
  }

  constructor() {
    super(...arguments);

    this.store.setDefaultState({
      cells: [],
      ships: []
    });
  }

  updateView({cells, gameState}) {
    if (cells) {
      this.updateCells(cells);
    }
    if (gameState) {
      this.disabledGrid = gameState !== GameController.ATTACHED_SHIPS;
      this.updateGridState();
    }
  }

  updateGridState() {
    this.root.classList[this.disabledGrid ? 'add' : 'remove']('disabled');
  }

  updateCells(cells = []) {
    this.removeShips();
    cells.forEach(({x, y}) => {
      const ship = document.createElement('div');
      ship.classList.add(UserGrid.SHIP_CLASS);
      const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${x}"] [data-${Grid.CELL_KEY}="${y}"]`);
      if (target instanceof Element) {
        target.appendChild(ship);
      }
    });
  }

  removeShips() {
    this.root.querySelectorAll(`.ship-area .${UserGrid.SHIP_CLASS}`).forEach(node => node.remove());
  }
}

UserGrid.SHIP_CLASS = 'ship';

export default UserGrid;