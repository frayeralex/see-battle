import './main.styl';

import GameController from './core/GameController';
import Store from './store/Store';

import initState from './config/initState';
import config from './config/config';

const store = Store.init(initState);
GameController.bootstrap(store, config);


