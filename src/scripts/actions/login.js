import * as actions from '../constants/ActionTypes';

export function loginRequest(id, credentials) {
    return { type: actions.LOGIN_REQUEST, id, credentials};
}

export function loginSuccess(id, message) {
    return { type: actions.LOGIN_SUCCESS, id, message };
}

export function loginFailure(id, message) {
    return { type: actions.LOGIN_FAILURE, id, message };
}

export function fetchFilesRequest(id, dirpath) {
    return { type: actions.FETCH_FILES_REQUEST, id, dirpath};
}

export function fetchFilesSuccess(id, files) {
    return { type: actions.FETCH_FILES_SUCCESS, id, files };
}

export function fetchFilesFailure(id, message) {
    return { type: actions.FETCH_FILES_FAILURE, id, message };
}

