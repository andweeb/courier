import * as types from '../constants/ActionTypes';

export function loginRequest(id, credentials) {
    return { type: types.LOGIN_REQUEST, id, credentials};
}

export function loginSuccess(id, message) {
    return { type: types.LOGIN_SUCCESS, id, message };
}

export function loginFailure(id, message) {
    return { type: types.LOGIN_FAILURE, id, message };
}

export function fetchFilesRequest(id, dirpath) {
    return { type: types.FETCH_FILES_REQUEST, id, dirpath};
}

export function fetchFilesSuccess(id, files) {
    return { type: types.FETCH_FILES_SUCCESS, id, files };
}

export function fetchFilesFailure(id, message) {
    return { type: types.FETCH_FILES_FAILURE, id, message };
}

export function handleEvent(event) {
    console.log(JSON.stringify(event));
    switch (event.fxn) {
        case types.LOGIN_SUCCESS:
            return loginSuccess(event.id, event.data);
            break;
        case types.LOGIN_FAILURE:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling the login failure action');
            return loginFailure(event.id, event.data);
            break;
        case types.FETCH_FILES_SUCCESS:
            return fetchFilesSuccess(event.id, event.data);
            break;
        case types.FETCH_FILES_FAILURE:
            return fetchFilesFailure(event.id, event.data);
            break;
        default:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nUnhandled event error!');
            break;
    }
    return;
}

