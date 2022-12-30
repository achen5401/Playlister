import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: "",
        guest: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage,
                    guest: auth.guest
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage,
                    guest: payload.guest
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: "",
                    guest: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage,
                    guest: false
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, username, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, username, email, password, passwordVerify);      
            if (response.status === 200) {
                if (firstName == "--------" &&
                lastName == "--------" &&
                username == "--------" &&
                email == "--------" &&
                password == "--------" &&
                passwordVerify == "--------") {
                    authReducer({
                        type: AuthActionType.REGISTER_USER,
                        payload: {
                            user: response.data.user,
                            guest: true
                        }
                    })
                }
            else {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        guest: false
                    }
                })
                auth.loginUser(email, password);
            }
            }
        }
        catch(error) {
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    errorMessage: error.response.data.errorMessage,
                }
            });
        }
    }

    auth.loginUser = async function(email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                if (email == "--------" && password == "--------") {
                    authReducer({
                        type: AuthActionType.LOGIN_USER,
                        payload: {
                            user: response.data.user,
                            loggedIn: true,
                            guest: true
                        }
                    })
                }
                else {
                    authReducer({
                        type: AuthActionType.LOGIN_USER,
                        payload: {
                            user: response.data.user,
                            loggedIn: true,
                            guest: false
                        }
                    })
                }
                history.push("/home");
            }
        }
        catch(error){
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    errorMessage: error.response.data.errorMessage,
                }
            });
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null,
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.unmarkError = function(){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false,
                errorMessage: "", 
            }
        });
    }

    auth.guestUser = function() {
        if (auth.guestMade == 0) {
            auth.registerUser("--------", "--------", "--------", "--------", "--------", "--------");
        }
        else {
            auth.loginUser("--------", "--------");
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };