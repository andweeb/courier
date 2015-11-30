import * as types from '../constants/ActionTypes';

export function login() {
    
}

export function loginRequest(id) {
    return { type: types.LOGIN_REQUEST };
}

export function loginFailure(id, error) {
    return { type: types.LOGIN_FAIL, id, error };
}

export function loginSuccess(id, error) {
    return { type: types.LOGIN_SUCCESS, id, error };
}

export function fetchFilesRequest(id, error) {
    return { type: types.FETCH_FILES_REQUEST };
}

export function fetchFilesFailure(id, error) {
    return { type: types.FETCH_FILES_FAIL, id, error };
}

export function fetchFilesSuccess(id, files, error) {
    return { type: types.FETCH_FILES_SUCCESS, id, error };
}
