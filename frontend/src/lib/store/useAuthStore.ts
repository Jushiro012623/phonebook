import {create} from "zustand";
import {persist} from "zustand/middleware";

export type AuthUser = {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
};

type AuthState = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    accessToken: string | null;

    setAuth: (payload: {
        user: AuthUser;
        accessToken?: string;
    }) => void;

    setUser: (user: AuthUser) => void;

    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            accessToken: null,

            setAuth: ({user, accessToken}) =>
                set({
                    isAuthenticated: true,
                    user,
                    accessToken: accessToken ?? null,
                }),

            setUser: (user) =>
                set((state) => ({
                    ...state,
                    user,
                })),

            clearAuth: () =>
                set({
                    isAuthenticated: false,
                    user: null,
                    accessToken: null,
                }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                accessToken: state.accessToken,
            }),
        },
    ),
);