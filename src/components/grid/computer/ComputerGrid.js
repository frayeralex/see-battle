import Grid from '../Grid';
import GameController from '../../../core/GameController';


class ComputerGrid extends Grid {
  static init() {
    return new this(...arguments);
  }

  constructor() {
    super(...arguments);
    this.disabledGrid = true;
  }

  updateView({computerCells, gameState, userMissCells, userHitCells}) {
    if (computerCells) {
      this.updateCells(computerCells);
    }

    if (gameState) {
      switch (gameState) {
        case GameController.USER_ACTION:
          this.root.classList.remove('disabled');
          break;
        case GameController.ATTACHED_SHIPS:
          this.root.classList.add('disabled');
          break;
        case GameController.COMP_ACTION:
          this.root.classList.add('disabled');
          break;
        default:
          return null;
      }
    }

    if (userMissCells) {
      this.updateMissCells(userMissCells);
    }

    if (userHitCells) {
      this.updateHitCells(userHitCells)
    }
  }

  updateMissCells(cells = []) {
    this.removeBySelector(`.${ComputerGrid.MISS_CELL_CLASS}`);
    cells.forEach(({x, y}) => {
      const ship = document.createElement('div');
      ship.classList.add(ComputerGrid.MISS_CELL_CLASS);
      const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${x}"] [data-${Grid.CELL_KEY}="${y}"]`);
      if (target instanceof Element) {
        target.appendChild(ship);
      }
    });
  }

  updateHitCells(cells = []) {
    this.removeBySelector(`.${ComputerGrid.HIT_CELL_CLASS}`);
    cells.forEach(({x, y}) => {
      const ship = document.createElement('div');
      ship.classList.add(ComputerGrid.HIT_CELL_CLASS);
      const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${x}"] [data-${Grid.CELL_KEY}="${y}"]`);
      if (target instanceof Element) {
        target.appendChild(ship);
      }
    });
  }

  removeBySelector(selector) {
    this.root.querySelectorAll(selector).forEach(node => node.remove());
  }
}

ComputerGrid.MISS_CELL_CLASS = 'miss';
ComputerGrid.HIT_CELL_CLASS = 'hit';

export default ComputerGrid;