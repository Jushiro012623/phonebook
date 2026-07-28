import {useToastStore, type ToastOptions} from "#/lib/store";
import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const toast = {
    show: ({title, description, type = 'info'}: ToastOptions) => {
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