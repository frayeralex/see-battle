import Store from '../../store/Store';


class AbstractElement {
  constructor(element, store) {
    if (!(store instanceof Store)) throw new Error('Store is require');
    this.root = element;
    this.store = store;

    this.unsubscribeStore = this.store.subscribe(this.updateView.bind(this));
  }

  updateView() {
  }

  bindHandler(element, type, action, options = {}) {
    element.addEventListener(type, action.bind(this), options);
  }

  removeBySelector(selector) {
    this.root.querySelectorAll(selector).forEach(node => node.remove());
  }
}

export default AbstractElement;