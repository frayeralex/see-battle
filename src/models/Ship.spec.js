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

  describe('#updateRelative', () => {
    it('should update relativeCells property after init Ship instance', () => {
      ship.relativeCells.forEach(([x, y]) => {
        expect(relatives).to.deep.include({x, y});
      });
      expect(ship.relativeCells).to.have.lengthOf(relatives.length);
    });

    it('should update relativeCells property after Ship merge new coordinates', () => {
      ship.merge(5 ,2);
      const newRelatives = [{x: 5, y: 1}, {x: 5, y: 4}];
      ship.relativeCells.forEach(([x, y]) => {
        expect(newRelatives).to.deep.include({x, y});
      });
      expect(ship.relativeCells).to.have.lengthOf(newRelatives.length);
    });

    it('should update relativeCells property after Ship remove chunk', () => {
      ship.merge(5, 2);
      const newRelatives = [{x: 5, y: 1}, {x: 5, y: 4}];
      ship.relativeCells.forEach(([x, y]) => {
        expect(newRelatives).to.deep.include({x, y});
      });
      expect(ship.relativeCells).to.have.lengthOf(newRelatives.length);
      ship.removeChunk(5, 2);
      ship.relativeCells.forEach(([x, y]) => {
        expect(relatives).to.deep.include({x, y});
      });
      expect(ship.relativeCells).to.have.lengthOf(relatives.length);
    });
  });

  describe('#updateNearestCells', () => {
    it('should update nearestCells property after init Ship instance', () => {
      const nearestCells = [
        ...relatives,
        {x: 4, y: 2}, {x: 6, y: 2},
        {x: 4, y: 4}, {x: 6, y: 4}
      ];
      ship.nearestCells.forEach(([x, y]) => {
        expect(nearestCells).to.deep.include({x, y});
      });
      expect(ship.nearestCells).to.have.lengthOf(nearestCells.length);
    });

    it('should update nearestCells property after Ship merge new coordinates', () => {
      ship.merge(5, 2);
      const newNearest = [
        {x: 5, y: 1}, {x: 5, y: 4},
        {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 4},
        {x: 6, y: 1}, {x: 6, y: 2}, {x: 6, y: 3}, {x: 6, y: 4},
      ];
      ship.relativeCells.forEach(([x, y]) => {
        expect(newNearest).to.deep.include({x, y});
      });
      expect(ship.nearestCells).to.have.lengthOf(newNearest.length);
    });

    it('should update nearestCells property after Ship remove chunk', () => {
      const nearestCells = [
        ...relatives,
        {x: 4, y: 2}, {x: 6, y: 2},
        {x: 4, y: 4}, {x: 6, y: 4}
      ];
      ship.merge(5, 2);
      ship.removeChunk(5, 2);
      ship.nearestCells.forEach(([x, y]) => {
        expect(nearestCells).to.deep.include({x, y});
      });
      expect(ship.nearestCells).to.have.lengthOf(nearestCells.length);
    });
  });

  describe('#filterCells', () => {
    it('should return true if cell coordinats in range from 1 to 10', () => {
      const coordinats = [];
      for (let x = 1; x <=10; x++) {
        for (let y = 1; y <= 10; y++) {
          coordinats.push([x,y]);
        }
      }
      coordinats.forEach(coordinatItem => {
        expect(ship.filterCells(coordinatItem)).to.be.true;
      });
    });

    it('should return false if cell coordinats in range less 1 and greatest 10', () => {
      const coordinats = [];
      for (let x = 11; x <=20; x++) {
        for (let y = -10; y <= 0; y++) {
          coordinats.push([x,y]);
        }
      }
      coordinats.forEach(coordinatItem => {
        expect(ship.filterCells(coordinatItem)).to.be.false;
      });
    });
  });

  describe('#isValid', () => {
    it('should return true if number in range from 1 to 10', () => {
      const coordinats = [];
      for (let x = 1; x <=10; x++) {
        coordinats.push(x)
      }
      coordinats.forEach(coordinatItem => {
        expect(ship.isValid(coordinatItem)).to.be.true;
      });
    });

    it('should return false if cell number in range less 1 and greatest 10', () => {
      const coordinats = [];
      for (let x = 11; x <=20; x++) {
        coordinats.push(x)
      }
      for (let x = -10; x <=0; x++) {
        coordinats.push(x)
      }
      coordinats.forEach(coordinatItem => {
        expect(ship.isValid(coordinatItem)).to.be.false;
      });
    });
  });
});
