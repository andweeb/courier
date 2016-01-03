const StoreInitialState = {
    login: {
        isAttemptingLogin: false,
        isAuthenticated: false,
        message: "",
        type: "",
        data: []
    },
    lastAction: {
        id: -1,
        type: "",
        data: []
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
