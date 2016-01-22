import { StoreInitialState } from '../constants/InitialStates.js';
import { FILE_SELECTED, FILE_SELECTED_META, FILE_DESELECTED } from '../constants/ActionTypes.js';

export function handleFileEvent(state = StoreInitialState, action) {
    console.log('[IN REDUCERS/FILE.JS] -> \nHandling action:');
    console.dir(action);
    console.log("FILE STATE: ");
    console.dir(state);

    switch (action.type) {
        case FILE_SELECTED:
            console.log('[IN REDUCERS/FILES.JS] -> \nHandling the file selected action');
            state.selected = { [action.file.Filename] : action.file };
            return state;

        case FILE_SELECTED_META:
            console.log('[IN REDUCERS/FILES.JS] -> \nHandling the file selected action');
            state.selected[action.file.Filename] = action.file;
            return state;

        case FILE_DESELECTED:
            console.log('[IN REDUCERS/FILES.JS] -> \nHandling the file selected action');
            delete state.selected[action.file.Filename];
            return state;

        default:
            console.log(`[IN REDUCERS/FILE.JS] -> \nUnhandled action type error: ${action.type}`);
            return state;
    }
}
