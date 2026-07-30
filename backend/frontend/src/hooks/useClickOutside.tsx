import {type RefObject, useEffect} from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void
) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;

            if (ref.current && !ref.current.contains(target)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, callback]);
}