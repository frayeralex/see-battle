import './main.styl';

// Model
import Store from './store/Store';

// View
import Statistic from './components/statistic/Statistic';
import UserGrid from './components/grid/user/UserGrid';
import ComputerGrid from './components/grid/computer/ComputerGrid';
import Controls from './components/controls/Controls';

// ViewModel
import GameController from './core/GameController';
import UserGridController from './core/UserGridController';
import ComputerGridController from './core/ComputerGridController';


const config = {
  components: [
    {
      selector: '#statistic',
      view: Statistic
    },
    {
      selector: '#controls',
      view: Controls
    },
    {
      selector: '.sea-blocks .user',
      view: UserGrid,
      controller: UserGridController
    },
    {
      selector: '.sea-blocks .computer',
      view: ComputerGrid,
      controller: ComputerGridController
    },
  ]
};

const store = Store.init();
GameController.bootstrap(store, config);


