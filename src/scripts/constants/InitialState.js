const loginState = {
    isAttemptingLogin: false, 
    isAuthenticated: false,
    message: "",
};

const lastActionState = {
    type: "",
    data: "",
    files: {},
};

const InitialState = { 
    login: loginState, 
    lastAction: lastActionState 
};

export default InitialState;
