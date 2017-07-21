import Grid from '../components/grid/Grid';
import Store from '../store/Store';
import Ship from '../models/Ship';


class GridComposer {
  static init() {
    return new this(...arguments);
  }

  constructor(gridView, store) {
    if (!(gridView instanceof Grid)) throw new Error('Grid is require');
    if (!(store instanceof Store)) throw new Error('Store is require');
    this.grid = gridView;
    this.store = store;

    this.store.setDefaultState({
      cells: [],
      ships: []
    });

    this.grid.addEventHandler(Grid.EVENT_CELL_CLICKED, this._onCellClicked.bind(this));
  }

  _onCellClicked({position}) {
    const {cells} = this.store.state;

    const cell = cells.find(cell => cell.x === position.x && cell.y === position.y);
    if (cell) {
      this.removeState(position);
      return this.store.setState({cells: cells.filter(item => item !== cell)});
    }
    this.addState(position);
  }

  removeState(position) {
    const ship = this.ships.find(ship => ship.isInCoordinates(position.x, position.y));
    if (ship) {
      if (ship.type > 1) {
        ship.removeChunk(position.x, position.y);
        return this.store.setState({ships: this.ships});
      }
      this.store.setState({ships: this.ships.filter(item => item !== ship)});
    }
  }

  get ships() {
    return this.store.state.ships;
  }

  addShip(ship) {
    this.store.setState({ships: [...this.ships, ship]});
  }

  addCell(position) {
    this.store.setState({cells: [...this.store.state.cells, position]});
  }

  addState({x, y}) {
    if (this.store.state.cells.length >= 20) return;

    if (!this.ships.length) {
      this.addCell({x, y});
      return this.addShip(Ship.create(x, y));
    }

    const mergeShip = this.ships.find(ship => ship.canMerge(x, y));
    if (mergeShip) {
      if (this.ships.filter(ship => ship.isNearest(x, y)).length > 1) return;
      if (this.delayMerge(mergeShip)) return;

      this.addCell({x, y});
      mergeShip.merge(x, y);
      return this.store.setState({ships: this.ships});
    }

    if (this.ships.every(ship => ship.isNotNearest(x, y))) {
      this.addCell({x, y});
      return this.addShip(Ship.create(x, y));
    }
  }

  delayMerge(ship) {
    const {type2, type3, type4} = this.ships.reduce((res, ship) => {
      res[`type${ship.type}`] ? res[`type${ship.type}`].push(ship) : res[`type${ship.type}`] = [ship];
      return res;
    }, {});
    switch (ship.type) {
      case 4:
        return true;
        break;
      case 3:
        if (type4) return true;
        break;
      case 2:
        if (type3 && type3.length >= GridComposer.type3 && type4) {
          return true;
        }
        break;
      case 1:
        if (type2 && type3 && type2.length >= GridComposer.type2 && type3.length >= GridComposer.type3 && type4) {
          return true;
        }
        break;
      default:
        return false;
    }
  }
}

GridComposer.type4 = 1;
GridComposer.type3 = 2;
GridComposer.type2 = 3;
GridComposer.type1 = 4;


export default GridComposer;