import Grid from '../Grid';
import GameController from '../../../core/GameController';


class UserGrid extends Grid {
  static init() {
    return new this(...arguments);
  }

  constructor() {
    super(...arguments);
  }

  updateView({cells, gameState, compMissCells, compHitCells}) {
    if (cells) {
      this.updateCells(cells);
    }

    if (gameState) {
      this.disabledGrid = gameState !== GameController.ATTACHED_SHIPS;
      this.updateGridState();
    }

    if (compMissCells) {
      this.updateMissCells(compMissCells);
    }

    if (compHitCells) {
      this.updateHitCells(compHitCells);
    }
  }

  updateGridState() {
    this.root.classList[this.disabledGrid ? 'add' : 'remove']('disabled');
  }

  updateCells(cells = []) {
    this.removeBySelector(`.ship-area .${UserGrid.SHIP_CLASS}`);
    cells.forEach(({x, y}) => {
      const ship = document.createElement('div');
      ship.classList.add(UserGrid.SHIP_CLASS);
      const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${x}"] [data-${Grid.CELL_KEY}="${y}"]`);
      if (target instanceof Element) {
        target.appendChild(ship);
      }
    });
  }
}

UserGrid.SHIP_CLASS = 'ship';

export default UserGrid;