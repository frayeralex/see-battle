import AbstractView from '../common/AbstractView';


class Grid extends AbstractView {
  constructor() {
    super(...arguments);

    this.eventHandlers = [];
    this.renderGrid();
    this.root.addEventListener('click', this.onCellClick.bind(this));
  }

  renderGrid() {
    for (let row = 1; row <= 10; row++) {
      const rowNode = this.createNode(Grid.NODE_TYPE, [Grid.ROW_CLASS], {[Grid.ROW_KEY]: row});
      for (let cell = 1; cell <= 10; cell++) {
        const cellNode = this.createNode(Grid.NODE_TYPE, [Grid.CELL_CLASS], {[Grid.CELL_KEY]: cell});
        rowNode.appendChild(cellNode);
      }
      this.root.appendChild(rowNode);
    }
    const shipsArea = document.createElement(Grid.NODE_TYPE);
    shipsArea.classList.add('ship-area');

    for (let row = 1; row <= 10; row++) {
      const rowNode = this.createNode(Grid.NODE_TYPE, [Grid.ROW_CLASS], {[Grid.ROW_KEY]: row});
      for (let cell = 1; cell <= 10; cell++) {
        const cellNode = this.createNode(Grid.NODE_TYPE, [Grid.CELL_CLASS], {[Grid.CELL_KEY]: cell});
        rowNode.appendChild(cellNode);
      }
      shipsArea.appendChild(rowNode);
    }
    this.root.appendChild(shipsArea);
  }

  createNode(type, classList, attr) {
    const node = document.createElement(type);
    classList.forEach(name => node.classList.add(name));
    Object.keys(attr).forEach((key) => {
      if (node && node.dataset) {
        node.dataset[key] = attr[key];
      }
    });
    return node;
  }

  addEventHandler(type, callback) {
    this.eventHandlers.push({type, callback});
    return () => this.removeEventHandler(type, callback);
  }

  removeEventHandler(type, callback) {
    this.eventHandlers = this.eventHandlers.filter(handler => !(handler.callback === callback && handler.type === type));
  }

  getCellPosition(event = {}) {
    if (event.target instanceof Element) {
      const position = {};
      if (event.target.classList.contains(Grid.CELL_CLASS)) {
        position.y = parseInt(event.target.dataset[Grid.CELL_KEY]);
        position.x = parseInt(event.target.parentElement.dataset[Grid.ROW_KEY]);
      }
      return position;
    }
  }

  onCellClick(event) {
    const position = this.getCellPosition(event);
    this.triggerEvents({type: Grid.EVENT_CELL_CLICKED, position});
  }

  triggerEvents(customEvent) {
    this.eventHandlers.forEach(handler => {
      if (customEvent.type === handler.type) {
        handler.callback(customEvent);
      }
    });
  }

  updateMissCells(cells = []) {
    this.removeBySelector(`.${Grid.MISS_CELL_CLASS}`);
    cells.forEach(({x, y}) => {
      const ship = document.createElement('div');
      ship.classList.add(Grid.MISS_CELL_CLASS);
      const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${x}"] [data-${Grid.CELL_KEY}="${y}"]`);
      if (target instanceof Element) {
        target.appendChild(ship);
      }
    });
  }

  updateHitCells(cells = []) {
    this.removeBySelector(`.${Grid.HIT_CELL_CLASS}`);
    cells.forEach(({x, y}) => {
      const ship = document.createElement('div');
      ship.classList.add(Grid.HIT_CELL_CLASS);
      const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${x}"] [data-${Grid.CELL_KEY}="${y}"]`);
      if (target instanceof Element) {
        target.appendChild(ship);
      }
    });
  }
}

Grid.CELL_CLASS = 'cell';
Grid.CELL_KEY = 'cellkey';
Grid.ROW_CLASS = 'row';
Grid.ROW_KEY = 'rowkey';
Grid.NODE_TYPE = 'div';
Grid.EVENT_CELL_CLICKED = 'cellClicked';
Grid.MISS_CELL_CLASS = 'miss';
Grid.HIT_CELL_CLASS = 'hit';

export default Grid;