import { LoginUser, OperatorLogged } from "app/interfaces/User";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface SessionStore {
    loginUser : LoginUser | undefined;
    operatorLogged : OperatorLogged | undefined;
}

interface SessionActions {
    setLoginUser:(loginUser : LoginUser | undefined) => void
    setOperatorLogged:(operatorLogged : OperatorLogged | undefined) => void
}


export const useSessionStore = create(
    persist<SessionStore & SessionActions>(
        set => ({
            loginUser : undefined,
            operatorLogged : undefined,
            setLoginUser: value => {
                set({loginUser : value});
            },
            setOperatorLogged: value => {
                set({operatorLogged : value});
            }
        }),
        {
            name: 'session-storage',
            version: 1,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);