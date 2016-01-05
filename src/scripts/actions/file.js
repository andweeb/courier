import * as actions from '../constants/ActionTypes.js';

export function fileSelected(id, file) {
    return { type: actions.FILE_SELECTED, id, file };
}

export function fileUnselected(id, file) {
    return { type: actions.FILE_UNSELECTED, id, file };
}
