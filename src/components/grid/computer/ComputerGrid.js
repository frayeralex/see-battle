import Grid from '../Grid';
import GameController from '../../../core/GameController';


class ComputerGrid extends Grid {
  static init() {
    return new this(...arguments);
  }

  constructor() {
    super(...arguments);
    this.disabledGrid = true;
      this.root.classList.add('disabled');
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
}

export default ComputerGrid;