const initialState = {
    hostname: "",
    port: "",
    username: "",
    password: "",
    type: "",
    message: "",
    isAttemptingLogin: false, 
    isAuthenticated: false,
    opacity: 1,
    shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)",
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
