import { 
	LOGIN_REQUEST,
	LOGIN_FAILURE,
	LOGIN_SUCCESS,
	FETCH_FILES_REQUEST,
	FETCH_FILES_FAILURE,
	FETCH_FILES_SUCCESS,
} from '../constants/ActionTypes';

import {
    loginSuccess,
    loginFailure,
    fetchFilesSuccess,
    fetchFilesFailure,
} from '../actions/login.js'

const initialState = [
    {
        isAttemptingLogin: false,
        authenticated: false 
    }
];
