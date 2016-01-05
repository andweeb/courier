import * as actions from '../constants/ActionTypes.js';

export function fileSelected(id, file) {
    return { type: actions.FILE_SELECTED, id, file };
}

export function fileDeselected(id, file) {
    return { type: actions.FILE_DESELECTED, id, file };
}
