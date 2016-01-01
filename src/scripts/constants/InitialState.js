const initialState = {
    hostname: "",
    port: "",
    username: "",
    password: "",
    isAttemptingLogin: false, 
    isAuthenticated: false,
    message: "",
};

const lastActionState = {
    type: "",
    data: "",
    files: {},
    credentials: {},
};

const InitialState = { 
    login: initialState, 
    lastAction: lastActionState 
};

export default InitialState;
