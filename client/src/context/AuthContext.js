import { createContext, useEffect, useReducer } from 'react';
import AuthReducer from './AuthReducer';

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    // useEffect para guardar el usuario en el localStorage para evitar que cuando se recargue la pagina se cierre la sesion
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.currentUser));
    }, [state.currentUser])

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};