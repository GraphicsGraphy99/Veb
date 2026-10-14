// Reusable label + input wrapper with accessible error/hint wiring.
export function fieldAria(id, error, hint) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return { "aria-invalid": Boolean(error), "aria-describedby": describedBy || undefined };
}

export default function Field({ id, label, required = false, error, hint, children }) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && <small className="hint" id={`${id}-hint`}>{hint}</small>}
      {error && <p className="error-text" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
