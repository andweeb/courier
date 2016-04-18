import { 
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    FETCH_FILES_REQUEST,
    FETCH_FILES_FAILURE,
    FETCH_FILES_SUCCESS,
} from '../constants/ActionTypes';

import {
    loginRequest,
    loginSuccess,
    loginFailure,
    fetchFilesSuccess,
    fetchFilesFailure,
} from '../actions/login.js';

import update from 'react-addons-update';
import { StoreInitialState } from '../constants/InitialStates.js';

export function previous(state = StoreInitialState, action) {
    if(!state) {
        return StoreInitialState;
    } else {
        return action;
    }
}

export function handleLoginEvent(state = StoreInitialState, action) {
    console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling login action:');
    console.dir(action);

    console.log("LOGIN STATE: ");
    console.dir(state);
    switch (action.type) {
        case LOGIN_REQUEST: 
        case FETCH_FILES_REQUEST:
            console.log('[IN REDUCERS/?REQUEST.JS] -> \nHandling the request action');
            return update(state, {
                [action.id] : {
                    isLoading: { $set: true }
                }
            });

        case LOGIN_SUCCESS:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the login success action');
            return update(state, {
                [action.id] : {
                    message: { $set: action.data[0] },
                    isLoading: { $set: false },
                    isAuthenticated: { $set: true }
                }
            });

        case LOGIN_FAILURE:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the login failure action');
            return update(state, {
                [action.id] : {
                    message: { $set: action.data[0] },
                    isLoading: { $set: false },
                    isAuthenticated: { $set: false }
                }
            });

        case FETCH_FILES_SUCCESS:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the fetch files success action');
            return update(state, {
                [action.id] : {
                    type: { $set: FETCH_FILES_SUCCESS },
                    files: { $set: action.data.files || [] },
                    path: { $set: action.data.path },
                    isLoading: { $set: false }
                }
            });

        case FETCH_FILES_FAILURE:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the fetch files failure action');
            return update(state, {
                [action.id] : {
                    type: { $set: FETCH_FILES_FAILURE },
                    files: { $set: action.data },
                    isLoading: { $set: false }
                }
            });

        default:
            console.log(`[IN REDUCERS/LOGIN.JS] -> \nUnhandled action type error: ${action.type}`);
            return state;
    }
}
