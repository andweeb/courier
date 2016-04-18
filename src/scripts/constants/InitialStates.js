const StoreInitialState = {
    login: {
        0: {
            isAuthenticated: false,
            isLoading: false,
            message: "",
            type: ""
        },
        1: {
            isAuthenticated: false,
            isLoading: false,
            message: "",
            type: ""
        },
        2: {
            isAuthenticated: false,
            isLoading: false,
            message: "",
            type: ""
        }
    },


    lastAction: {
        0: {
            id: -1,
            type: "",
            data: []
        },
        1: {
            id: -1,
            type: "",
            data: []
        },
        2: {
            id: -1,
            type: "",
            data: []
        }
    },

    file: {
        0: {
            selected: {}
        },
        1: {
            selected: {}
        },
        2: {
            selected: {}
        }
    }
};

const AppInitialState = {
    windows: [0, 1, 2]
};

const WindowInitialState = {
    0: {
        zIndex: 0
    },
    1: {
        zIndex: 0
    },
    2: {
        zIndex: 0
    },
};

const LoginInitialState = {
    opacity: 1,
    hostname: "",
    port    : "",
    username: "",
    password: "",
    shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)"
};

const FileManagerInitialState = {
    opacity: 1,
    shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)"
};

export { 
    StoreInitialState, 
    AppInitialState, 
    LoginInitialState,
    WindowInitialState,
    FileManagerInitialState
};
