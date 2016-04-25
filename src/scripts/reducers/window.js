import update from 'react-addons-update';
import { WindowInitialState } from '../constants/InitialStates';
import { WINDOW_FOCUSED } from '../constants/ActionTypes';

export function handleWindowEvent(state = WindowInitialState, action) {
    console.log('[IN REDUCERS/WINDOW.JS] -> \nHandling z action:');
    console.dir(action);

    console.log("WINDOW STATE: ");
    console.dir(state);
    switch (action.type) {
        case WINDOW_FOCUSED:
            console.log('[IN REDUCERS/WINDOW.JS] -> \nHandling the window focused action');
            let max = -1;
            for(let id in state) {
                if(state[id].zIndex > max) {
                    max = state[id].zIndex;
                }
            }
            return update(state, {
                [action.id]: {
                    zIndex: { $set: max + 1 }
                }
            });


        default:
            console.log(`[IN REDUCERS/WINDOW.JS] -> \nUnhandled action type error: ${action.type}`);
            return state;
    }
}

