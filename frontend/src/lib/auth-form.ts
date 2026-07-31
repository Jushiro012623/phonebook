import {toast} from "#/lib/utils";
import {parseApiError} from "#/lib/api-error";

export function handleAuthFormError(
  error: unknown,
  fallbackTitle: string,
  setErrors: (errors: Record<string, string>) => void
) {
  const {message, fieldErrors} = parseApiError(error);

  if (Object.keys(fieldErrors).length > 0) {
    setErrors(fieldErrors);
  }

  toast.error(fallbackTitle, message);
}
