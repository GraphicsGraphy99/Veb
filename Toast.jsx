// aria-live region so screen readers announce feedback such as "Added to cart".
export default function Toast({ message }) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {message && <div className="toast">{message}</div>}
    </div>
  );
}
