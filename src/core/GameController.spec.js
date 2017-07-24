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
        game.components.forEach(({node, componentView, controller}) => {
          expect(componentView).is.instanceOf(AbstractView);
        })
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

  });
});