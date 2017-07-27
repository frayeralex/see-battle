import 'jsdom-global/register';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import { readFileSync } from 'fs';
import { join } from 'path';

const html = readFileSync(join(__dirname, '../index.html')).toString();

import GameController from './GameController';
import config from '../config/config';
import initState from '../config/initState';
import Store from '../store/Store';
import AbstractView from '../components/common/AbstractView';
import Ship from '../models/Ship';

describe('GameController', () => {
  let store;
  let game;

  beforeEach(() => {
    document.body.innerHTML = html;
    store = Store.init(initState);
    game = GameController.bootstrap(store, config);
  });


  describe('Static methods', () => {
    describe('#bootstrap', () => {
      it('should return instance of GameController', () => {
        expect(game).is.instanceOf(GameController);
      });

      it('should contain components', () => {
        game.components.forEach(({componentView}) => {
          expect(componentView).is.instanceOf(AbstractView);
        });
      });

      it('should contain store', () => {
        expect(game.store).is.instanceOf(Store);
      });

      it('should add subscribers to store publishing', () => {
        expect(store._subscribers).lengthOf(5);
      });
    });

    describe('#randomNumber', () => {
      it('should return random number from 0 to 10', () => {
        let randomNumber = [];
        for (let i = 1; i <=1000; i++) {
          randomNumber.push(GameController.randomNumber(10));
        }
        randomNumber.forEach(number => {
          expect(number >= 0).to.be.true;
          expect(number <= 10).to.be.true;
        });
        for (let number = 0; number <= 10; number++) {
          expect(randomNumber).to.include(number);
        }
      });
    });

    describe('#shipsToCells', () => {
      it('should return array of ship coordinats', () => {
        const ships = [];
        for (let i = 1; i <=10; i++) {
          ships.push(Ship.create(i, i));
        }
        const cells = GameController.shipsToCells(ships);
        cells.forEach((cell) => {
          expect(cell[0] === cell[1]).to.be.true;
        });
        expect(cells).lengthOf(10);
      });
    });

    describe('#createRandomShips', () => {
      let ships;

      beforeEach(() => {
        ships = GameController.createRandomShips();
      });

      it('should return 10 ships with random coordinats', () => {
        expect(ships).lengthOf(10);
        ships.forEach(ship => {
          expect(ship).is.instanceOf(Ship);
        });
      });
      it('should return 1 4-cell ship', () => {
        const cells = ships.filter(ship => ship.type === 4);
        expect(cells).lengthOf(1);
      });
      it('should return 2 3-cell ships', () => {
        const cells = ships.filter(ship => ship.type === 3);
        expect(cells).lengthOf(2);
      });
      it('should return 3 2-cell ships', () => {
        const cells = ships.filter(ship => ship.type === 2);
        expect(cells).lengthOf(3);
      });
      it('should return 4 1-cell ships', () => {
        const cells = ships.filter(ship => ship.type === 1);
        expect(cells).lengthOf(4);
      });
      it('should be one cell margin between ships', () => {
        ships
          .filter(item => item !== ships[0])
          .forEach(ship => {
            const {x, y} = ship.coordinats;
            expect(ship.isNotNearest(x, y)).to.be.true;
          });
      });
    });
  });

  describe('getters', () => {
    it('#gameState should return gameState property from store', () => {
      store.setDefaultState({gameState: GameController.END_GAME});
      expect(game.gameState).to.be.equal(GameController.END_GAME);
    });

    it('#attempts should return gameState property from store', () => {
      const attempts = {all: 10};
      store.setDefaultState({attempts});
      expect(game.attempts).to.be.equal(attempts);
    });

    it('#ships should return gameState property from store', () => {
      const ships = 'ships';
      store.setDefaultState({ships});
      expect(game.ships).to.be.equal(ships);
    });
  });

  describe('methods', () => {
    describe('#observeChanges', () => {
      it('should delegate run to observeMethod', () => {
        let calls = 0;
        game.testObserve = () => { calls++; };
        game.nextObserve = () => { calls++; };
        store.setState({test: true, next: true});
        expect(calls).to.be.equal(2);
      });
    });

    describe('#gameStateObserve', () => {
      it('should in case ATTACHED_SHIPS change store state to default', () => {
        const data = [1,2,3,4,5];
        store.setDefaultState({
          cells: [...data],
          ships: [...data],
          compShips: [...data],
          userMissCells: [...data],
          userHitCells: [...data],
          compMissCells: [...data],
          compHitCells: [...data],
          compCanHitCells: [...data],
        });
        expect(game.ships).to.include(...data);
        expect(game.compShips).to.include(...data);
        expect(game.compMissCells).to.include(...data);
        expect(game.compHitCells).to.include(...data);
        expect(game.compCanHitCells).to.include(...data);
        store.setState({gameState: GameController.ATTACHED_SHIPS});
        expect(game.ships).lengthOf(0);
        expect(game.compShips).lengthOf(0);
        expect(game.compMissCells).lengthOf(0);
        expect(game.compHitCells).lengthOf(0);
        expect(game.compCanHitCells).lengthOf(100);
      });

      it('should in case ATTACHED_COPM_SHIPS update compShip state', () => {
        store.setState({gameState: GameController.ATTACHED_COPM_SHIPS});
        expect(game.compShips).lengthOf(10);
        game.compShips.forEach(ship => {
          expect(ship).is.instanceOf(Ship);
        });
      });
    });

    describe('#isGameOver', () => {
      it('should return true if computer or user ships are killer or false instead', () => {
        const ships = GameController.createRandomShips();
        store.setDefaultState({
          ships: [...ships],
          compShips: [...ships]
        });
        expect(game.isGameOver()).to.be.false;

        store.setState({ships: ships.map(ship => {
          ship.coordinats.map(coordinat => {
            coordinat.status = Ship.KILL;
            return coordinat;
          });
          return ship;
        })});

        expect(game.isGameOver()).to.be.true;
      });
    });

    describe('#runCompAction', () => {
      it('should update compMissCells, compHitCells, compCanHitCells', () => {
        const ships = GameController.createRandomShips();
        store.setDefaultState({
          ships: [...ships],
          compShips: [...ships]
        });
        game.runCompAction();
        expect(game.compCanHitCells).not.lengthOf(100);
        expect(game.compHitCells).not.lengthOf(game.compMissCells);
        expect(game.gameState).is.oneOf([GameController.COMP_ACTION, GameController.USER_ACTION]);
      });
    });
  });
});