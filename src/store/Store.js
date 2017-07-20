/**
 * Observable store
 */
class Store {
  static init(object = {}) {
    return new Store(object);
  }

  constructor(object) {
    this._state = object;
    this._subscribers = [];
  }

  /**
   * Return store properties
   * @returns {*}
   */
  get state() {
    return this._state;
  }

  /**
   * Clear all properties from store
   */
  reset() {
    this._state = {};
    this._publish();
  }

  /**
   * Update store properties
   * @param object
   */
  setState(object) {
    if (typeof object !== 'object') return;
    this._state = {...this._state, ...object};
    this._publish(object);
  }

  setDefaultState(object) {
    if (typeof object !== 'object') return;
    this._state = {...this._state, ...object};
  }

  /**
   * Subscribe to store updates
   * @param action
   * @returns {*}
   */
  subscribe(action) {
    if (typeof action !== 'function') return null;
    this._subscribers.push(action);
    return () => this._unsubscribe(action);
  }

  /**
   * Method to remove subscription
   * @param action
   * @private
   */
  _unsubscribe(action) {
    this._subscribers = this._subscribers.filter((item) => item !== action);
  }

  /**
   * Run all subscriptions actions
   * @param updatedProps
   * @private
   */
  _publish(updatedProps = {}) {
    this._subscribers.forEach(action => action(updatedProps));
  }
}

export default Store;