class Ship {
  static create(x, y) {
    return new Ship(x, y);
  }

  constructor(x, y) {
    if (typeof x !== 'number') throw new Error('No valid x ');
    if (typeof y !== 'number') throw new Error('No valid y ');
    this.coordinats = [{x, y, status: Ship.OK}];
    this.globalUpdate();
  }

  canMerge(x, y) {
    return this.relativeCells.some(([X, Y]) => X === x && Y === y);
  }

  merge(x, y) {
    if (this.canMerge(x, y)) {
      this.coordinats.push({x, y, status: Ship.OK});
      this.globalUpdate();
    }
  }

  removeChunk(x, y) {
    if (this.isInCoordinates(x, y)) {
      this.coordinats = this.coordinats.filter(({x: X, y: Y}) => !(X === x && Y === y));
      this.globalUpdate();
    }
  }

  isNotNearest(x, y) {
    return !this.isNearest(x, y);
  }

  isNearest(x, y) {
    return this.nearestCells.findIndex(([X, Y]) => X === x && Y === y) !== -1;
  }

  isShipNearest(ship) {
    return ship.coordinats.some(({x, y}) => this.isNearest(x, y));
  }

  isInCoordinates(x, y) {
    return !!this.coordinats.find(({x: X, y: Y}) => X === x && Y === y);
  }

  setDamage(x, y) {
    this.coordinats.forEach((cell) => {
      if (cell.x === x && cell.y === y) {
        cell.status = Ship.BAD;
      }
    });
    if (this.coordinats.every(cell => cell.status === Ship.BAD)) {
      this.coordinats = this.coordinats.map(cell => {
        cell.status = Ship.KILL;
        return cell;
      });
    }
  }

  isKilled() {
    return this.coordinats.every(({status}) => status === Ship.KILL);
  }

  globalUpdate() {
    this.type = this.coordinats.length;
    this.updateNearestCells();
    this.updateRelative();
  }

  updateRelative() {
    this.relativeCells = this.coordinats
      .reduce((xy, {x, y}) => {
        xy.push([x + 1, y]);
        xy.push([x - 1, y]);
        xy.push([x, y - 1]);
        xy.push([x, y + 1]);
        return xy;
      }, [])
      .filter(xy => !this.isInCoordinates(xy[0], xy[1]))
      .filter(this.filterCells.bind(this));

    if (this.type > 1) {
      const isHorisontall = this.coordinats.every(({x, y}) => x === this.coordinats[0].x);
      const key = isHorisontall ? 'x' : 'y';
      const index = isHorisontall ? 0 : 1;
      const value = this.coordinats[0][key];
      this.relativeCells = this.relativeCells
        .filter((xy) => xy[index] === value);
    }
  }

  updateNearestCells() {
    this.nearestCells = this.coordinats
      .reduce((xy, {x, y}) => {
        xy.push([x, y - 1]);
        xy.push([x, y + 1]);
        xy.push([x - 1, y - 1]);
        xy.push([x - 1, y + 1]);
        xy.push([x + 1, y - 1]);
        xy.push([x + 1, y + 1]);
        xy.push([x + 1, y]);
        xy.push([x - 1, y]);
        return xy;
      }, [])
      .filter(xy => !this.isInCoordinates(xy[0], xy[1]))
      .filter(this.filterCells.bind(this))
      .reduce((arr, item) => {
        if (!arr.find(xy => xy[0] === item[0] && xy[1] === item[1])) {
          arr.push(item);
        }
        return arr;
      }, []);
  }

  filterCells([x, y]) {
    return this.isValid(x) && this.isValid(y);
  }

  isValid(coordinate) {
    return 1 <= coordinate && coordinate <= 10;
  }
}

Ship.MAX_X = 10;
Ship.MAX_Y = 10;
Ship.OK = 'ok';
Ship.BAD = 'bad';
Ship.KILL = 'kill';

export default Ship;