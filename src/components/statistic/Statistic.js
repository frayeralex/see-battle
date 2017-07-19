import AbstractElement from '../common/AbstractElement';

class Statistic extends AbstractElement{
    constructor(){
        super(...arguments);

        this.ship4 = this.root.querySelector('[data-type="4"] .count');
        this.ship3 = this.root.querySelector('[data-type="3"] .count');
        this.ship2 = this.root.querySelector('[data-type="2"] .count');
        this.ship1 = this.root.querySelector('[data-type="1"] .count');
        this.ships = {};
    }

    updateView(updatedProps = {}){
        console.log(updatedProps);

        if (updatedProps.ships) {
            this.ships = {};
            this.ships = updatedProps.ships.reduce((ships, ship) => {
                ships[ship.type] ? ships[ship.type].push(ship) : ships[ship.type] = [ship];
                return ships;
            }, {});
            this.root.querySelectorAll('.count').forEach(node => node.innerHTML = '');
            Object.keys(this.ships).forEach(key => {
                this.updateNode(this[`ship${key}`], this.ships[key].length);
            });
        }
    }

    updateNode(node, html){
        node.innerHTML = html;
    }
}

export default Statistic;