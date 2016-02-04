import * as actions from '../constants/ActionTypes';

export function windowFocused(id) {
    return { type: actions.WINDOW_FOCUSED, id };
}

