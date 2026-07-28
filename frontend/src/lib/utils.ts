import {useToastStore, type ToastOptions} from "#/lib/store";

export const toast = {
    show: ({ title, description, type = 'info' }: ToastOptions) => {
        useToastStore.getState().addToast({
            title,
            description,
            type,
        })
    },

    success: (title: string, description?: string) => {
        useToastStore.getState().addToast({
            title,
            description,
            type: 'success',
        })
    },

    error: (title: string, description?: string) => {
        useToastStore.getState().addToast({
            title,
            description,
            type: 'error',
        })
    },

    info: (title: string, description?: string) => {
        useToastStore.getState().addToast({
            title,
            description,
            type: 'info',
        })
    },
}