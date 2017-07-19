import './main.styl';
import Store from './store/Store';

// Components
import Statistic from './components/statistic/Statistic';
import Grid from './components/grid/Grid';

//
import GridComposer from './components/grid/GridComposer';

const store = Store.init({
    cells: [],
    ships: [],
});

const userGridNode = document.querySelector('.sea-blocks .user');
const userGrid = Grid.init(userGridNode, store);

GridComposer.init(userGrid, store);

new Statistic(document.querySelector('#statistic'), store);


