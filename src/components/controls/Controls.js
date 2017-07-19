import AbstractElement from '../common/AbstractElement';

class Controls extends AbstractElement{
    static init() {
        return new this(...arguments);
    }

    constructor() {
        super(...arguments);

    }
}
export default Controls;