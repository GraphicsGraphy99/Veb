import { useState } from "react";
import { formatINR } from "../utils/format.js";
import { MAX_QUANTITY } from "../hooks/useCart.js";

export default function ServiceCard({ service, onAdd }) {
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const inputId = `qty-${service.id}`;

  const handleAdd = () => {
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount < 1 || amount > MAX_QUANTITY) {
      setError(`Enter a whole number from 1 to ${MAX_QUANTITY}.`);
      return;
    }
    setError("");
    onAdd(service, amount);
    setQuantity("1");
  };

  return (
    <article className="card service-card">
      <div className="service-icon" aria-hidden="true">{service.icon}</div>
      <h3>{service.name}</h3>
      <p className="muted">{service.description}</p>
      <p className="price">
        <strong>{formatINR(service.price)}</strong> <span>{service.unit}</span>
      </p>
      <div className="qty-row">
        <label htmlFor={inputId}>{service.quantityLabel}</label>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX_QUANTITY}
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      {error && <p className="error-text" id={`${inputId}-error`} role="alert">{error}</p>}
      <button type="button" className="btn btn-primary btn-block" onClick={handleAdd}>
        Add to Cart
      </button>
    </article>
  );
}
