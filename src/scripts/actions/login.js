import * as types from '../constants/ActionTypes';

export default function handleEvent(event) {
    console.log('--> in handleEvent()');
    console.log(JSON.stringify(event));
    switch (event.fxn) {
        case LOGIN_SUCCESS:
            loginSuccess(event.id, event.data);
            break;
        case LOGIN_FAILURE:
            loginFailure(event.id, event.data);
            break;
        case FETCH_FILES_SUCCESS:
            fetchFilesSuccess(event.id, event.data);
            break;
        case FETCH_FILES_FAILURE:
            fetchFilesFailure(event.id, event.data);
            break;
    }
    return;
}

export function loginRequest(id, credentials) {
    return { type: types.LOGIN_REQUEST, id, credentials};
}

export function loginFailure(id, message) {
    return { type: types.LOGIN_FAIL, id, message };
}

export function loginSuccess(id, message) {
    return { type: types.LOGIN_SUCCESS, id, message };
}

export function fetchFilesRequest(id, dirpath) {
    return { type: types.FETCH_FILES_REQUEST, id, dirpath};
}

export function fetchFilesFailure(id, message) {
    return { type: types.FETCH_FILES_FAIL, id, message };
}

export function fetchFilesSuccess(id, files, error) {
    return { type: types.FETCH_FILES_SUCCESS, id, error };
}
