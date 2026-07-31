import {createFileRoute} from '@tanstack/react-router'
import {getUsers} from "#/api/users.ts";

export const Route = createFileRoute("/")({
    loader: async () => getUsers(),
    component: Home
});

function Home() {
    const users = Route.useLoaderData();
    return <pre>{JSON.stringify(users, null, 2)}</pre>;
}