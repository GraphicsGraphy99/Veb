import { formatINR } from "../utils/format.js";
import { MAX_QUANTITY } from "../hooks/useCart.js";

export default function Cart({ cart, onChangeQuantity, onRemove, onProceed }) {
  const { items, total, count } = cart;

  return (
    <div className="card cart-card">
      <h3>
        Your Cart {count > 0 && <span className="muted">({count} {count === 1 ? "unit" : "units"})</span>}
      </h3>

      {items.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-icon" aria-hidden="true">🧺</span>
          <p><strong>Your cart is empty.</strong></p>
          <p className="muted">Browse our services and tap “Add to Cart” to get started.</p>
          <a href="#services" className="btn btn-outline">Browse services</a>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <span className="muted">{formatINR(item.price)} {item.unit}</span>
                </div>
                <div className="qty-stepper" role="group" aria-label={`Quantity for ${item.name}`}>
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    disabled={item.quantity >= MAX_QUANTITY}
                    onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total" aria-label={`Subtotal ${formatINR(item.subtotal)}`}>
                  {formatINR(item.subtotal)}
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => onRemove(item)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Grand total</span>
            <strong>{formatINR(total)}</strong>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={onProceed}>
            Proceed to Booking
          </button>
        </>
      )}
    </div>
  );
}
