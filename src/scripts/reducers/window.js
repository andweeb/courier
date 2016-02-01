import update from 'react-addons-update';
import { WindowInitialState } from '../constants/InitialStates';
import { WINDOW_FOCUSED } from '../constants/ActionTypes';

export function handleWindowEvent(state = WindowInitialState, action) {
    console.log('[IN REDUCERS/WINDOW.JS] -> \nHandling z action:');
    console.dir(action);

    switch (action.type) {
        case WINDOW_FOCUSED:
            console.log('[IN REDUCERS/WINDOW.JS] -> \nHandling the window focused action');
            let totalZ = 0;
            for(let i = 0; i < Object.keys(state).length; i++) {
                totalZ += state[i].zIndex;
            }
            return update(state, {
                [action.id] : {
                    zIndex: { $set: totalZ - state[action.id].zIndex + 1 }
                }
            });

        default:
            console.log(`[IN REDUCERS/WINDOW.JS] -> \nUnhandled action type error: ${action.type}`);
            return state;
    }
}

