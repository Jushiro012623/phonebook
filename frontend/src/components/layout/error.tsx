import {GridBackground} from "@components/layout/grid-background.tsx";
import {Button} from "@components/ui";

type ErrorComponentProps = {
    message?: string;
    title?: string
};

export function ErrorComponent({
                                   message = "An unexpected error occurred.",
                                   title = "Internal Error",
                               }: ErrorComponentProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <GridBackground/>

            <div className="card shadow-xl p-10 max-w-lg w-full text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Unexpected Error
                </p>

                <h1 className="font-serif text-4xl md:text-5xl">
                    {title}
                </h1>

                <p className="mt-4 text-muted-foreground">{message}</p>

                <div className="my-8 h-px bg-border"/>

                <Button onClick={() => window.location.reload()} className="w-full">
                    Try Again
                </Button>
            </div>
        </div>
    );
}