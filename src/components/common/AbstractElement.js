import Store from '../../store/Store';

class AbstractElement {
    constructor(element, store){
        if (element instanceof Element !== true) throw new Error('Element is require');
        if (!(store instanceof Store)) throw new Error('Store is require');
        this.root = element;
        this.store = store ;

        this.unsubscribeStore = this.store.subscribe(this.updateView.bind(this));
    }

    updateView() {}

    bindHandler(element, type, action, options = {}){
        element.addEventListener(type, action.bind(this), options)
    }
}

export default AbstractElement;