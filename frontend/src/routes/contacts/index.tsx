import {createFileRoute} from '@tanstack/react-router'
import {getContacts} from "#/api/contacts.ts";

export const Route = createFileRoute('/contacts/')({
    component: Contacts,
    loader: async () => getContacts()

})

function Contacts() {
    const contacts = Route.useLoaderData();
    return <pre>{JSON.stringify(contacts, null, 2)}</pre>;
}
