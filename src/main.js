import './main.styl';
import Store from './store/Store';
import GameController from "./core/GameController";

// Components
import Statistic from './components/statistic/Statistic';
import Grid from './components/grid/Grid';
import Controls from './components/controls/Controls';

//
import GridComposer from './components/grid/GridComposer';


const store = Store.init();
GameController.observe(store);

const statisticNode = document.querySelector('#statistic');
const statisticView = Statistic.init(statisticNode, store);

const controlsNode = document.querySelector('#controls');
const controlsView = Controls.init(controlsNode, store);

const userGridNode = document.querySelector('.sea-blocks .user');
const userGrid = Grid.init(userGridNode, store);

GridComposer.init(userGrid, store);


