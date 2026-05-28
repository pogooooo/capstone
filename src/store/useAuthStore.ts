import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    name: string;
    nickname: string;
    cpu: number;
}

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            accessToken: null,
            user: null,
            login: (token, user) => set({ isAuthenticated: true, accessToken: token, user }),
            logout: () => set({ isAuthenticated: false, accessToken: null, user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);