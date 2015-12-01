import { 
	LOGIN_REQUEST,
	LOGIN_FAILURE,
	LOGIN_SUCCESS,
	FETCH_FILES_REQUEST,
	FETCH_FILES_FAILURE,
	FETCH_FILES_SUCCESS,
} from '../constants/ActionTypes';

const initialState = [
    {
        isAttemptingLogin: false,
        authenticated: false 
    }
];

export function handleEvent(event) {
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

export function login(state = initialState, action) {
    switch(action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isAttemptingLogin: true
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isAttemptingLogin: false,
                error: action.error,
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
