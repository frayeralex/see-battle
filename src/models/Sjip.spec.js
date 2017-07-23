import {expect} from 'chai';
import {describe, it} from 'mocha';

import Ship from './Ship';

describe('Ship', () => {
  let ship;
  const X = 5;
  const Y = 3;

  const relatives = [
    {x: 5, y: 2},
    {x: 5, y: 4},
    {x: 4, y: 3},
    {x: 6, y: 3},
  ];

  const noRelatives = [
    {x: 10, y: 2},
    {x: 5, y: 10},
    {x: 1, y: 3},
    {x: 6, y: 1},
  ];

  beforeEach(() => {
    ship = Ship.create(X, Y);
  });

  describe('#create', () => {
    it('should create instance of Ship', () => {
      expect(ship).to.be.an.instanceOf(Ship);
      expect(ship.coordinats).to.be.an('array');
      expect(ship.coordinats).to.have.lengthOf(1);
      expect(ship.coordinats[0].x).to.equal(X);
      expect(ship.coordinats[0].y).to.equal(Y);
      expect(ship.coordinats[0].status).to.equal(Ship.OK);
    });
  });

  describe('#canMerge', () => {
    it('should return true when it is relative coordinats', () => {
      relatives.forEach(({x, y}) => {
        expect(ship.canMerge(x, y)).to.true;
      });
    });
  });

  describe('#merge', () => {
    it('should add new coordinats with ship.coordinats', () => {
      const {x, y} = relatives[0];
      ship.merge(x, y);

      expect(ship.coordinats).to.have.lengthOf(2);
      expect(ship.coordinats[1]).to.include({x, y});
    });
  });

  describe('#removeChunk', () => {
    it('should remove coordinat from ship.coordinats', () => {
      const {x, y} = relatives[0];
      ship.merge(x, y);
      ship.removeChunk(X, Y);

      expect(ship.coordinats).to.have.lengthOf(1);
      expect(ship.coordinats[0]).to.include({x, y});
    });
  });

  describe('#isNearest', () => {
    it('should return true when it check nearest coordinats', () => {
      relatives.forEach(({x, y}) => {
        expect(ship.isNearest(x, y)).to.true;
      });
    });

    it('shoul return false when it check no nearest coordinats', () => {
      noRelatives.forEach(({x, y}) => {
        expect(ship.isNearest(x, y)).to.be.false;
      })
    })
  });

  describe('#isShipNearest', () => {
    it('should return true when compare ship has nearest coordinats', () => {
      const {x, y} = relatives[1];
      const compareShip = Ship.create(x, y);

      expect(ship.isShipNearest(compareShip)).to.be.true;
    });

    it('should return false when compare ship has no nearest coordinats', () => {
      const {x, y} = noRelatives[1];
      const compareShip = Ship.create(x, y);

      expect(ship.isShipNearest(compareShip)).to.be.false;
    });
  });

  describe('#isInCoordinates', () => {
    it('should return true when compare coordinats is ship coordinats', () => {
      const {x, y} = relatives[2];
      ship.merge(x, y);
      expect(ship.isInCoordinates(X, Y)).to.be.true;
      expect(ship.isInCoordinates(x, y)).to.be.true;
    });
  });

  describe('#setDamage', () => {
    it('should update status of ship chunk to bad', () => {
      const {x, y} = relatives[2];
      ship.merge(x, y);
      ship.setDamage(X, Y);

      expect(ship.coordinats[0].status).to.equal(Ship.BAD);
    });

    it('should update status of ship chunk to kill if all chunks are in bad status', () => {
      const {x, y} = relatives[2];
      ship.merge(x, y);
      ship.setDamage(x, y);
      ship.setDamage(X, Y);

      ship.coordinats.forEach(({status}) => {
        expect(status).to.equal(Ship.KILL);
      });
    });
  });

  describe('#isKilled', () => {
    it('should return true when all ship chunk in status kill', () => {
      const {x, y} = relatives[2];
      ship.merge(x, y);
      ship.setDamage(X, Y);
      ship.setDamage(x, y);
      expect(ship.isKilled()).to.be.true;
    });

    it('should return false when some ship chunk has status ok', () => {
      const {x, y} = relatives[2];
      ship.merge(x, y);
      ship.setDamage(x, y);

      expect(ship.isKilled()).to.be.false;
    });
  });

});
