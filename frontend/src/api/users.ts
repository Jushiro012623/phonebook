import {redirect} from "@tanstack/react-router";
import {createServerFn} from "@tanstack/react-start";
import {getCookieValue} from "#/api/request.ts";
import {throwApiError} from "#/api/api-error.ts";

export const getUsers = createServerFn().handler(async () => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${getCookieValue('access-token')}`
        },
    });


    const result = await response.json().catch(() => ({}));

    if (response.status === 401) {
        throw redirect({
            to: "/auth/sign-in",
        });
    }

    if (!response.ok) {
        if (!response.ok) {
            throwApiError(response, result);
        }
    }

    return result
});