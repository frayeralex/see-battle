import GameController from '../core/GameController';

export default {
  cells: [],
  ships: [],
  compShips: [],
  userMissCells: [],
  userHitCells: [],
  compMissCells: [],
  compHitCells: [],
  gameState: GameController.ATTACHED_SHIPS,
  compCanHitCells: GameController.generateGridCoordinates(),
  attempts: {
    all: 0,
    success: 0
  },
  controls: {
    start: {
      label: 'Start',
      disabled: true
    },
    pause: {
      label: 'Pause',
      disabled: true
    },
    clear: {
      label: 'Clear',
      disabled: true
    },
    random: {
      label: 'Random generation',
      disabled: false
    }
  }
};
