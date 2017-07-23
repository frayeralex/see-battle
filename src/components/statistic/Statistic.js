import AbstractElement from '../common/AbstractView';


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
      attempt: {
        all: this.root.querySelector('.attempt [data-key="all"]'),
        success: this.root.querySelector('.attempt [data-key="success"]'),
        failed: this.root.querySelector('.attempt [data-key="failed"]'),
        percent: this.root.querySelector('.attempt [data-key="percent"]')
      },
      ships: {
        cell4: this.root.querySelector('.ships [data-key="4"]'),
        cell3: this.root.querySelector('.ships [data-key="3"]'),
        cell2: this.root.querySelector('.ships [data-key="2"]'),
        cell1: this.root.querySelector('.ships [data-key="1"]'),
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

    this.render();
  }

  updateView({attempts, compShips}) {
    if (attempts) {
      this.attempts = {...attempts};
      this.attempts.failed = this.attempts.all - this.attempts.success;
      this.attempts.percent = parseFloat((this.attempts.success * 100 / this.attempts.all).toFixed(2));
    }

    if (compShips) {
      for (let type = 1; type <= 4; type++) {
        this.aliveShips[`cell${type}`] = compShips.filter(ship => ship.type === type && !ship.isKilled()).length
      }
    }

    this.render(this.nodes);
  }

  render() {
    const {attempt, ships} = this.nodes;
    Object.keys(attempt).forEach((key) => {
      attempt[key].innerHTML = this.attempts[key];
    });
    Object.keys(ships).forEach((key) => {
      ships[key].innerHTML = this.aliveShips[key];
    });
  }
}

export default Statistic;