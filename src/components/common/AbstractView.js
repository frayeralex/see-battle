import Store from '../../store/Store';


class AbstractView {
  constructor(element, store) {
    if (!(store instanceof Store)) throw new Error('Store is require');
    this.root = element;
    this.store = store;

    this.unsubscribeStore = this.store.subscribe(this.updateView.bind(this));
  }

  updateView() {
  }

  removeBySelector(selector) {
    this.root.querySelectorAll(selector).forEach(node => node.remove());
  }
}

export default AbstractView;