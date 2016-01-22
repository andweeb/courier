import update from 'react-addons-update';
import { StoreInitialState } from '../constants/InitialStates.js';
import { FILE_SELECTED, FILE_GROUP_SELECTED, FILE_DESELECTED } from '../constants/ActionTypes.js';

export function handleFileEvent(state = StoreInitialState, action) {
    console.log('[IN REDUCERS/FILE.JS] -> \nHandling action:');
    console.dir(action);
    console.log("FILE STATE: ");
    console.dir(state);
    let newState = Object.assign({}, state);

    switch (action.type) {
        case FILE_SELECTED:
            console.log('[IN REDUCERS/FILES.JS] -> \nHandling the file selected action');
            newState = Object.assign({}, state);
            newState.selected = {};
            return update(newState, {
                selected: {
                    [action.file.Filename]: { $set: action.file }
                }
            });

        case FILE_GROUP_SELECTED:
            console.log('[IN REDUCERS/FILES.JS] -> \nHandling the file group selected action');
            return update(state, {
                selected: {
                    [action.file.Filename]: { $set: action.file }
                }
            });

        case FILE_DESELECTED:
            console.log('[IN REDUCERS/FILES.JS] -> \nHandling the file deselected action');
            newState.selected = Object.assign({}, state.selected);
            delete newState.selected[action.file.Filename];
            return newState;

        default:
            console.log(`[IN REDUCERS/FILE.JS] -> \nUnhandled action type error: ${action.type}`);
            return state;
    }
}
