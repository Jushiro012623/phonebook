import {useState} from "react";
import {Eye, EyeClosed} from "lucide-react";

export function useEyeToggle() {
    const [type, setType] = useState<FormPassword>("password");

    const toggle = () => {
        setType((prev) => (prev === "password" ? "text" : "password"));
    };

    const icon = type === "password"
        ? <Eye size={16}/>
        : <EyeClosed size={16}/>;

    return {
        type,
        toggle,
        icon,
        isVisible: type === "text",
    };
}