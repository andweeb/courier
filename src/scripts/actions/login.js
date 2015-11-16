import * as types from '../constants/ActionTypes';

export function loginFail(id, error) {
    return { type: types.LOGIN_FAIL, id, error };
}

export function loginSuccess(id, error) {
    return { type: types.LOGIN_SUCCESS, id, error };
}

export function listFiles(id, files) {
    return { type: types.LIST_FILES, id, files };
}
