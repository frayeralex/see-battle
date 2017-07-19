import AbstractElement from '../common/AbstractElement';

class Grid extends AbstractElement{
    static init(){
        return new this(...arguments);
    }

    constructor(){
        super(...arguments);
        this._renderGrid();

        this._eventHandlers = [];
        this.store.setState();
    }

    _renderGrid(){
        for (let indexRow = 1; indexRow <= 10; indexRow++) {
            const rowElement = document.createElement(Grid.NODE_TYPE);
            rowElement.classList.add(Grid.ROW_CLASS);
            rowElement.dataset[Grid.ROW_KEY] = indexRow;

            for (let indexCell = 1; indexCell <= 10; indexCell++) {
                const element = document.createElement(Grid.NODE_TYPE);
                element.classList.add(Grid.CELL_CLASS);
                element.dataset[Grid.CELL_KEY] = indexCell;
                rowElement.appendChild(element);
            }

            this.root.appendChild(rowElement);
        }
        const shipsArea = document.createElement(Grid.NODE_TYPE);
        shipsArea.classList.add('ship-area');

        for (let indexRow = 1; indexRow <= 10; indexRow++) {
            const rowElement = document.createElement(Grid.NODE_TYPE);
            rowElement.classList.add(Grid.ROW_CLASS);
            rowElement.dataset[Grid.ROW_KEY] = indexRow;

            for (let indexCell = 1; indexCell <= 10; indexCell++) {
                const element = document.createElement(Grid.NODE_TYPE);
                element.classList.add(Grid.CELL_CLASS);
                element.dataset[Grid.CELL_KEY] = indexCell;
                rowElement.appendChild(element);
            }

            shipsArea.appendChild(rowElement);
        }
        this.root.appendChild(shipsArea);

        this.root.addEventListener('click', this._onCellClick.bind(this))
    }

    addEventHandler(type, callback) {
        this._eventHandlers.push({ type, callback });
        return () => this.removeEventHandler(type, callback);
    }

    removeEventHandler(type, callback) {
        this._eventHandlers = this._eventHandlers.filter(handler => !(handler.callback === callback && handler.type === type));
    }

    _getCellPosition(event = {}){
        if (event.target instanceof Element) {
            const position = {};
            if (event.target.classList.contains(Grid.CELL_CLASS)) {
                position.y = parseInt(event.target.dataset[Grid.CELL_KEY]);
                position.x = parseInt(event.target.parentElement.dataset[Grid.ROW_KEY]);
            }
            return position;
        }
    }

    updateView({ cells }){
        if (cells) {
            this.updateCells(cells);
        }
    }

    updateCells(cells = []){
        this.removeShips();
        cells.forEach(position => {
            const ship = document.createElement('div');
            ship.classList.add('ship');
            const target = this.root.querySelector(`.ship-area [data-${Grid.ROW_KEY}="${position.x}"] [data-${Grid.CELL_KEY}="${position.y}"]`);
            if (target instanceof Element) {
                target.appendChild(ship);
            }
        })
    }

    removeShips(){
        this.root.querySelectorAll('.ship-area .ship').forEach(node => node.remove());
    }

    _onCellClick(event){
        const position = this._getCellPosition(event);
        this._triggerEvents({type: Grid.EVENT_CELL_CLICKED, position });
    }

    _triggerEvents(customEvent){
        this._eventHandlers.forEach(handler => {
            if (customEvent.type === handler.type) {
                handler.callback(customEvent);
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


export default Grid;