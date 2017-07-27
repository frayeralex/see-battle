import {expect} from 'chai';
import {describe, it} from 'mocha';

import Store from './Store';


describe('Store', () => {
  let store;

  beforeEach(() => {
    store = Store.init(storeMock);
  });

  describe('#init', () => {
    it('should create instanse of Store object', () => {
      expect(store).to.be.an.instanceof(Store);
    });
  });

  describe('#state', () => {
    it('should return store state object', () => {
      expect(store.state).to.deep.equal(storeMock);
    });
  });

  describe('#subscribe', () => {
    it('should save subscribe action after subscription', () => {
      const action = () => 'action called';
      store.subscribe(action);

      expect(store._subscribers).to.be.an('array').that.includes(action);
    });

    it('should return unsubscribe action method', () => {
      const action = () => 'action called';
      const unsubscribe = store.subscribe(action);
      unsubscribe();

      expect(store._subscribers).to.be.an('array').that.not.includes(action);
    });

    it('should not throw error if parametr is not a function', () => {
      expect(() => store.subscribe(1)).to.not.throw();
      expect(() => store.subscribe('string')).to.not.throw();
      expect(() => store.subscribe(null)).to.not.throw();
      expect(() => store.subscribe({})).to.not.throw();
      expect(() => store.subscribe([])).to.not.throw();
    });
  });

  describe('#setState', () => {
    it('should update or add properties to store state', () => {
      const newValue = {bar: 2};
      store.setState({foo: newValue});

      expect(store.state.foo).to.equal(newValue);
      expect(store.state.foo).to.not.include(storeMock.foo);
      expect(store.state.baz).to.equal(storeMock.baz);
    });

    it('should trigger publishing after store state updated', () => {
      let publishCallCount = 0;
      const action = () => publishCallCount++;
      store.subscribe(action);

      store.setState({bar: 1});
      store.setState({bar: 2});
      store.setState({bar: 3});

      expect(publishCallCount).to.equal(3);
    });
  });

  describe('#setDefaultState', () => {
    it('should update store but not run subscription actions', () => {
      let publishCallCount = 0;
      const action = () => publishCallCount++;
      store.subscribe(action);

      store.setDefaultState({bar: 1});
      expect(publishCallCount).to.equal(0);
    });
  });

  describe('#reset', () => {
    it('should reset store state', () => {
      store.reset();
      expect(store.state).to.deep.equal({});
    });

    it('should trigger publishing after store state reset', () => {
      let publishCallCount = 0;
      const action = () => publishCallCount++;
      store.subscribe(action);

      store.reset();
      store.reset();

      expect(publishCallCount).to.equal(2);
    });
  });
});

const storeMock = {
  foo: {
    foo1: 1,
    foo2: 2,
    foo3: 3,
  },
  baz: {
    baz1: '1',
    baz2: '2',
    baz3: '3'
  }
};