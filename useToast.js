import { useCallback, useEffect, useRef, useState } from "react";

// Small "snackbar" message that disappears by itself.
export function useToast(duration = 3000) {
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  const notify = useCallback(
    (text) => {
      setMessage(text);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setMessage(""), duration);
    },
    [duration]
  );

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { message, notify };
}
