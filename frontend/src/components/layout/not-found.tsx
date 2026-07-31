import {Link} from "@tanstack/react-router"
import {Button} from "#/components/ui"
import {GridBackground} from "@components/layout/grid-background.tsx";

export function NotFound() {
    return (
        <div className="h-screen flex items-center justify-center px-6">
            <GridBackground/>
            <div className="card shadow-xl p-10 max-w-lg w-full text-center">

                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Route Not Found
                </p>

                <h1 className="font-serif text-4xl md:text-5xl leading-tight">
                    Someone got to it first.
                </h1>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                    This is no longer available. It may have been
                    removed, or archived.
                </p>

                <div className="my-8 h-px bg-border"/>

                <div className="space-y-3">
                    <Link to="/" className="block">
                        <Button className="w-full">
                            Back to Home
                        </Button>
                    </Link>

                    <Button
                        variant="muted"
                        className="w-full"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </div>

            </div>
        </div>
    )
}