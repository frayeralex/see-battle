import Grid from './Grid';
import GameController from "../../core/GameController";

class ComputerGrid extends Grid {
    static init(){
        return new this(...arguments);
    }

    constructor(){
        super(...arguments);
        this.disabledGrid = true;
        this.updateGridState();
    }

    updateView({ computerCells, gameState }){
        if (computerCells) {
            this.updateCells(computerCells);
        }

        if (gameState) {
            switch (gameState) {
                case GameController.USER_ACTION:
                    this.root.classList.remove('disabled');
                    break;
                case GameController.ATTACHED_SHIPS:
                    this.root.classList.add('disabled');
                    break;
                case GameController.COMP_ACTION:
                    this.root.classList.add('disabled');
                    break;
                default:
                    return null;
            }
        }
    }
}

export default ComputerGrid;