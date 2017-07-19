import AbstractElement from '../common/AbstractElement';

class Controls extends AbstractElement{
    /**
     * Create Control instance
     * @param {Element} element
     * @param {Store} store
     * @returns {Controls}
     */
    static init(element, store) {
        return new this(element, store);
    }

    constructor(element, store) {
        super(element, store);

        this.nodes = {
            controls: {
                start: this.root.querySelector('.start'),
                pause: this.root.querySelector('.pause'),
                clear: this.root.querySelector('.clear'),
            }
        };

        this.controls = {
            start: {
                label: 'Start',
                disabled: false
            },
            pause: {
                label: 'Pause',
                disabled: true
            },
            clear: {
                label: 'Clear',
                disabled: true
            }
        };

        this.nodes.controls.start.addEventListener('click', this.startClickHandler.bind(this));
        this.nodes.controls.pause.addEventListener('click', this.pauseClickHandler.bind(this));
        this.nodes.controls.clear.addEventListener('click', this.clearClickHandler.bind(this));

        this.render();
    }

    startClickHandler(){
        const newStart = {start: {...this.controls.start, ...{disabled: true, label: 'Start'}}};
        const newPause = {pause: {...this.controls.pause, ...{disabled: false}}};
        const newClear = {clear: {...this.controls.clear, ...{disabled: false}}};
        this.store.setState({
            controls: {
                ...this.controls,
                ...newStart,
                ...newPause,
                ...newClear
            }
        });
    }

    pauseClickHandler(){
        const newStart = {start: {...this.controls.start, ...{disabled: false, label: 'Continue!'}}};
        const newPause = {pause: {...this.controls.pause, ...{disabled: true}}};
        const newClear = {clear: {...this.controls.clear, ...{disabled: false}}};
        this.store.setState({
            controls: {
                ...this.controls,
                ...newStart,
                ...newPause,
                ...newClear
            }
        });
    }

    clearClickHandler(){
        const newStart = {start: {...this.controls.start, ...{disabled: true}}};
        const newPause = {pause: {...this.controls.pause, ...{disabled: true}}};
        const newClear = {clear: {...this.controls.clear, ...{disabled: true}}};
        this.store.setState({
            controls: {
                ...this.controls,
                ...newStart,
                ...newPause,
                ...newClear
            },
            cells: [],
            ships: {}
        });
    }

    updateView({ controls }) {
        if (controls) {
            this.controls = {...controls};
        }

        this.render();
    }

    render() {
        const { controls } = this.nodes;

        Object.keys(this.controls)
            .forEach((key) => {
                controls[key].innerHTML = this.controls[key].label;
                controls[key].disabled = this.controls[key].disabled;
            });
    }

}
export default Controls;