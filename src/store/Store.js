/**
 *
 */
class Store {
    static init(object = {}){
        return new Store(object);
    }

    constructor(object){
        this._state = object;
        this._subscribers = [];
    }

    get state(){
        return this._state;
    }

    reset(){
        this._state = {};
        this._publish();
    }

    setState(object){
        if (typeof object !== 'object') return;
        this._state = {...this._state, ...object};
        this._publish(object);
    }

    subscribe(action){
        if (typeof action !== "function") return;
        this._subscribers.push(action);
        return () => this._unsubscribe(action);
    }

    _unsubscribe(action){
        this._subscribers = this._subscribers.filter((item) => item !== action);
    }

    _publish(updatedProps = {}){
        this._subscribers.forEach(action => action(updatedProps));
    }
}

export default Store;