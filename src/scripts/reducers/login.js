import * from '../constants/ActionTypes';

export function login(state = { isAttemptingLogin: false, authenticated: false }, action) {
    switch(action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isAttemptingLogin: true
            });
        case LOGIN_FAIL:
            return Object.assign({}, state, {
                isAttemptingLogin: false,
                error: action.error
                id: action.id
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isAttemptingLogin: false,
                authenticated: true,
                id: action.id
            });
        default: return state;
    }
}
