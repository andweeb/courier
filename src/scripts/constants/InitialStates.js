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
        selected: []
    }
};

const AppInitialState = {
    hostname: "",
    port    : "",
    username: "",
    password: ""
};

const LoginInitialState = {
    opacity: 1,
    shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)"
};

export { 
    StoreInitialState, 
    AppInitialState, 
    LoginInitialState 
};
