const StoreInitialState = {
    login: {
        isAuthenticated: false,
        isAttemptingLogin: false,
        message: "",
        type: ""
    },

    lastAction: {
        id: -1,
        type: "",
        data: []
    },

    file: {
        selected: {}
    }
};

const AppInitialState = {
    windows: [0, 1, 2]
};

const LoginInitialState = {
    opacity: 1,
    hostname: "",
    port    : "",
    username: "",
    password: "",
    shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)"
};

export { 
    StoreInitialState, 
    AppInitialState, 
    LoginInitialState 
};
