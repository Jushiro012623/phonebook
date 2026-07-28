import {create} from "zustand";
import {v4 as uuidv4} from 'uuid';

export type ToastType = 'success' | 'error' | 'info'

export const TOAST_DURATION = 3000;

export type Toast = {
    id: string
    title: string
    description?: string
    type?: ToastType
    createdAt: number
}
export type ToastInput = {
    title: string
    description?: string
    type?: ToastType
}

export type ToastStore = {
    toasts: Toast[]
    addToast: (toast: ToastInput) => void
    removeToast: (id: string) => void
    clearToasts: () => void
}

export type ToastOptions = {
    title: string
    description?: string
    type?: ToastType
    duration?: number
}


export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],

    addToast: (toast: ToastInput) => {
        const id = uuidv4()
        const createdAt = Date.now()

        set((state) => ({
            toasts: [
                ...state.toasts,
                {
                    id,
                    createdAt,
                    type: toast.type ?? 'info',
                    title: toast.title,
                    description: toast.description,
                },
            ],
        }))

        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }))
        }, TOAST_DURATION)
    },

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),

    clearToasts: () => set({toasts: []}),
}))