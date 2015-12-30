const initialState = {
    hostname: "",
    port: "",
    username: "",
    password: "",
    isAttemptingLogin: false, 
    isAuthenticated: false,
};

const lastActionState = {
    id: -1,
    type: "",
    message: "",
    dirpath: "",
    files: {},
    credentials: {},
};

const InitialState = { 
    login: initialState, 
    lastAction: lastActionState 
};

export default InitialState;
