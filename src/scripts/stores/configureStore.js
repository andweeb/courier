import { createStore, combineReducers, compose } from 'redux';
import rootReducer from '../reducers/rootReducer';

import { devTools, persistState } from 'redux-devtools';

// Redux dev tools
const finalCreateStore = compose(
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState);
    return store;
}
