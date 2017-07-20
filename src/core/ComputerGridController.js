import Grid from '../components/grid/Grid';
import Store from '../store/Store';


class ComputerGridController {
  static init() {
    return new this(...arguments);
  }

  constructor(gridView, store) {
    if (!(gridView instanceof Grid)) throw new Error('Grid is require');
    if (!(store instanceof Store)) throw new Error('Store is require');
    this.grid = gridView;
    this.store = store;

    this.grid.addEventHandler(Grid.EVENT_CELL_CLICKED, this._onCellClicked.bind(this));
  }

  _onCellClicked({position}) {
    console.log(position);
  }
}

export default ComputerGridController;