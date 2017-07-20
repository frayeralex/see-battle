import './main.styl';
import Store from './store/Store';
import GameController from "./core/GameController";

// Components
import Statistic from './components/statistic/Statistic';
import UserGrid from './components/grid/UserGrid';
import ComputerGrid from './components/grid/ComputerGrid';
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
const userGrid = UserGrid.init(userGridNode, store);

const computerGridNode = document.querySelector('.sea-blocks .computer');
const computerGrid = ComputerGrid.init(computerGridNode, store);


GridComposer.init(userGrid, store);
GridComposer.init(computerGrid, store);


