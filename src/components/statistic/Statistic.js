import AbstractElement from '../common/AbstractView';
import GameController from "../../core/GameController";


class Statistic extends AbstractElement {
  /**
   *
   * @param {Element} element
   * @param {Store} store
   * @returns {Statistic}
   */
  static init(element, store) {
    return new this(element, store);
  }

  constructor(element, store) {
    super(element, store);

    this.nodes = {
      attempts: {
        all: this.root.querySelector('.attempt [data-key="all"]'),
        success: this.root.querySelector('.attempt [data-key="success"]'),
        failed: this.root.querySelector('.attempt [data-key="failed"]'),
        percent: this.root.querySelector('.attempt [data-key="percent"]')
      },
      aliveShips: {
        cell4: this.root.querySelector('.ships [data-key="4"]'),
        cell3: this.root.querySelector('.ships [data-key="3"]'),
        cell2: this.root.querySelector('.ships [data-key="2"]'),
        cell1: this.root.querySelector('.ships [data-key="1"]'),
      },
      global: {
        action: this.root.querySelector('.action')
      }
    };

    this.attempts = {
      all: 0,
      success: 0,
      failed: 0,
      percent: 0
    };

    this.aliveShips = {
      cell4: 1,
      cell3: 2,
      cell2: 3,
      cell1: 4
    };

    this.global = {
      action: 'Please set your ships'
    };

    this.render();
  }

  updateView({attempts, compShips, gameState}) {
    if (attempts) {
      this.attempts = {...attempts};
      this.attempts.failed = this.attempts.all - this.attempts.success;
      this.attempts.percent = this.attempts.all > 0 ? parseFloat((this.attempts.success * 100 / this.attempts.all).toFixed(2)) : 0;
    }

    if (compShips) {
      for (let type = 1; type <= 4; type++) {
        this.aliveShips[`cell${type}`] = compShips.filter(ship => ship.type === type && !ship.isKilled()).length
      }
    }

    if (gameState) {
      switch (gameState) {
          case GameController.ATTACHED_COPM_SHIPS:
            this.global.action = 'Computer set ships';
            break;
          case GameController.COMP_ACTION:
            this.global.action = 'Computer attempt!';
            break;
          case GameController.USER_ACTION:
            this.global.action = 'You attempt!';
            break;
          case GameController.END_GAME:
            const winner = this.store.state.ships.every(ship => ship.isKilled()) ? 'Game over, computer win!' : 'Congradulations! You win!';
            this.global.action = winner;
            break;
          default:
            this.global.action = 'Please set your ships';
      }
    }
    this.render();
  }

  render() {
    Object.keys(this.nodes).forEach((subject) => {
      Object.keys(this.nodes[subject]).forEach((node) => {
          this.nodes[subject][node].innerHTML = this[subject][node];
      });
    });
  }
}

export default Statistic;