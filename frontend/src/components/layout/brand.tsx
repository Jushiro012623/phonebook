import {Book} from "lucide-react";

export const Brand = () => {
    return (
        <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
                <Book size={18}/>
            </div>
            <span className="font-semibold font-figtree uppercase tracking-wide">
                Phonebook
            </span>
        </div>
    )
}