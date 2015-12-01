import { 
	LOGIN_REQUEST,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	FETCH_FILES_REQUEST,
	FETCH_FILES_FAIL,
	FETCH_FILES_SUCCESS,
} from '../constants/ActionTypes';

const initialState = [
    {
        isAttemptingLogin: false,
        authenticated: false 
    }
];

export default function login(state = initialState, action) {
    switch(action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isAttemptingLogin: true
            });
        case LOGIN_FAIL:
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
