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



interface GlobalStore {
  isModalOpen: boolean;
  showModalBackground: boolean;
  isMainScrollEnabled: boolean;
}

interface GlobalActions {
  setIsModalOpen: (value: boolean) => void;
  setShowModalBackground: (value: boolean) => void;
  setIsMainScrollEnabled: (value: boolean) => void;
}


export const useGlobalStore = create<GlobalStore & GlobalActions>(set => ({
    isModalOpen: false,
    showModalBackground: false,
    isMainScrollEnabled: true,
    setIsModalOpen: (value: boolean) => {
        set({ isModalOpen: value });
    },
    setShowModalBackground: (value: boolean) => {
        set({ showModalBackground: value });
    },
    setIsMainScrollEnabled: (value: boolean) => {
        set({ isMainScrollEnabled: value });
    }
}));
