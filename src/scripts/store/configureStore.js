import { createStore, combineReducers, compose } from 'redux';
import rootReducer from '../reducers/rootReducer';
import DevTools from '../containers/DevTools.jsx';
import { persistState } from 'redux-devtools';

// Redux dev tools
const finalCreateStore = compose(
    DevTools.instrument(),
    persistState()
)(createStore);

export default function configureStore(initialState) {
    return finalCreateStore(rootReducer, initialState);
}
