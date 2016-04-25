import { createUID } from '../utils';

const uid1 = createUID();
const uid2 = createUID();
const uid3 = createUID();

console.log(uid1, uid2, uid3);

const StoreInitialState = {
    login: {
        [uid1]: {
            isAuthenticated: false,
            isLoading: false,
            message: "",
            type: ""
        },
        [uid2]: {
            isAuthenticated: false,
            isLoading: false,
            message: "",
            type: ""
        },
        [uid3]: {
            isAuthenticated: false,
            isLoading: false,
            message: "",
            type: ""
        }
    },


    lastAction: {
        [uid1]: {
            id: -1,
            type: "",
            data: []
        },
        [uid2]: {
            id: -1,
            type: "",
            data: []
        },
        [uid3]: {
            id: -1,
            type: "",
            data: []
        }
    },

    file: {
        [uid1]: {
            selected: {}
        },
        [uid2]: {
            selected: {}
        },
        [uid3]: {
            selected: {}
        }
    }
};

const AppInitialState = {
    windows: [uid1, uid2, uid3]
};

const WindowInitialState = {
    [uid1]: {
        zIndex: 0
    },
    [uid2]: {
        zIndex: 0
    },
    [uid3]: {
        zIndex: 0
    },
};

const LoginInitialState = {
    opacity: 1,
    hostname: "",
    port    : "",
    username: "",
    password: "",
    shadow: "rgba(0, 0, 0, 0.247059) 1px 5px 20px -5px"
};

const FileManagerInitialState = {
    opacity: 1,
    shadow: "rgba(0, 0, 0, 0.247059) 1px 5px 20px -5px"
};

export { 
    StoreInitialState, 
    AppInitialState, 
    LoginInitialState,
    WindowInitialState,
    FileManagerInitialState
};
