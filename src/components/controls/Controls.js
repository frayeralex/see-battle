import AbstractElement from '../common/AbstractView';
import GameController from '../../core/GameController';


class Controls extends AbstractElement {
  /**
   * Create Control instance
   * @param {Element} element
   * @param {Store} store
   * @returns {Controls}
   */
  static init(element, store) {
    return new this(element, store);
  }

  constructor(element, store) {
    super(element, store);

    this.nodes = {
      controls: {
        start: this.root.querySelector('.start'),
        pause: this.root.querySelector('.pause'),
        clear: this.root.querySelector('.clear'),
        random: this.root.querySelector('.random')
      }
    };

    this.controls = this.store.state.controls;
    this.nodes.controls.start.addEventListener('click', this.startClickHandler.bind(this));
    this.nodes.controls.pause.addEventListener('click', this.pauseClickHandler.bind(this));
    this.nodes.controls.clear.addEventListener('click', this.clearClickHandler.bind(this));
    this.nodes.controls.random.addEventListener('click', this.randomClickHandler.bind(this));

    this.render();
  }

  startClickHandler() {
    this.store.setState({
      controls: {
        ...this.controls,
        ...{start: {...this.controls.start, ...{disabled: true, label: 'Start'}}},
        ...{pause: {...this.controls.pause, ...{disabled: false}}},
        ...{clear: {...this.controls.clear, ...{disabled: false}}},
        ...{random: {...this.controls.random, ...{disabled: true}}}
      },
      gameState: this.store.state.gameState === GameController.ATTACHED_SHIPS
        ? GameController.ATTACHED_COPM_SHIPS
        : this.store.state.gameState,
    });
  }

  pauseClickHandler() {
    this.store.setState({
      controls: {
        ...this.controls,
        ...{start: {...this.controls.start, ...{disabled: false, label: 'Continue!'}}},
        ...{pause: {...this.controls.pause, ...{disabled: true}}},
        ...{clear: {...this.controls.clear, ...{disabled: false}}}
      }
    });
  }

  clearClickHandler() {
    this.store.setState({
      controls: {
        ...this.controls,
        ...{start: {...this.controls.start, ...{disabled: false, label: 'Start'}}},
        ...{pause: {...this.controls.pause, ...{disabled: true}}},
        ...{clear: {...this.controls.clear, ...{disabled: true}}}
      },
      cells: [],
      ships: [],
      gameState: GameController.ATTACHED_SHIPS
    });
  }

  randomClickHandler() {
    const ships = GameController.createRandomShips();
    const cells = GameController.shipsToCells(ships);
    this.store.setState({ships, cells});
  }

  updateView({controls}) {
    if (controls) {
      this.controls = {...controls};
    }

    this.render();
  }

  render() {
    const { controls } = this.nodes;

    Object.keys(this.controls)
      .forEach((key) => {
        controls[key].innerHTML = this.controls[key].label;
        controls[key].disabled = this.controls[key].disabled;
      });
  }
}

export default Controls;