import { useState } from "react";
import Field, { fieldAria } from "./Field.jsx";
import { validateBooking } from "../utils/validation.js";
import { createBooking, TIME_SLOTS } from "../utils/booking.js";
import { formatINR, formatPickupDate, formatTimeLabel, todayISO } from "../utils/format.js";
import { sendBookingEmail, describeEmailError } from "../services/emailService.js";
import { isBookingEmailConfigured } from "../config/emailConfig.js";

const EMPTY_VALUES = { name: "", email: "", phone: "", address: "", date: "", time: "", instructions: "" };
const FIELD_ORDER = ["name", "email", "phone", "address", "date", "time", "instructions"];

function BookingSummary({ booking }) {
  return (
    <div className="summary">
      <dl className="summary-list">
        <div><dt>Reference</dt><dd><strong>{booking.reference}</strong></dd></div>
        <div><dt>Name</dt><dd>{booking.name}</dd></div>
        <div><dt>Email</dt><dd>{booking.email}</dd></div>
        <div><dt>Phone</dt><dd>{booking.phone}</dd></div>
        <div><dt>Pickup address</dt><dd>{booking.address}</dd></div>
        <div><dt>Pickup</dt><dd>{formatPickupDate(booking.date)}, {formatTimeLabel(booking.time)}</dd></div>
        <div><dt>Instructions</dt><dd>{booking.instructions || "None"}</dd></div>
      </dl>
      <table className="summary-table">
        <thead>
          <tr><th scope="col">Service</th><th scope="col">Qty</th><th scope="col">Price</th><th scope="col">Subtotal</th></tr>
        </thead>
        <tbody>
          {booking.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.name}</td>
              <td>{line.quantity}</td>
              <td>{formatINR(line.price)} {line.unit}</td>
              <td>{formatINR(line.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th scope="row" colSpan="3">Total</th><td><strong>{formatINR(booking.total)}</strong></td></tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function BookingForm({ cart, onConfirmed }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [cartError, setCartError] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null); // problem state: not configured / failed
  const [confirmation, setConfirmation] = useState(null); // success state

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const found = validateBooking(values);
    setErrors((prev) => {
      const next = { ...prev };
      if (found[name]) next[name] = found[name];
      else delete next[name];
      return next;
    });
  };

  const inputProps = (name) => ({
    id: `booking-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    ...fieldAria(`booking-${name}`, errors[name]),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    setNotice(null);

    const found = validateBooking(values);
    setErrors(found);

    if (cart.items.length === 0) {
      setCartError("Your cart is empty. Please add at least one service before booking.");
    } else {
      setCartError("");
    }

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`booking-${firstInvalid}`)?.focus();
      return;
    }
    if (cart.items.length === 0) return;

    const booking = createBooking(values, cart.items, cart.total);

    if (!isBookingEmailConfigured()) {
      setNotice({
        type: "warn",
        booking,
        message:
          "Email service is not configured, so NO email was sent and this booking is not confirmed. Add your EmailJS values to the .env file (see README, “Configure EmailJS”) and restart the dev server. Your details are kept below.",
      });
      return;
    }

    setSending(true);
    try {
      const { customerCopy } = await sendBookingEmail(booking);
      setConfirmation({ booking, customerCopy });
      cart.clearCart();
      onConfirmed?.(`Booking ${booking.reference} confirmed!`);
    } catch (error) {
      console.error("Booking email failed:", error);
      setNotice({
        type: "error",
        booking,
        message: `We could not send your booking email, so it is NOT confirmed. ${describeEmailError(error)} Your details are kept below – please try again.`,
      });
    } finally {
      setSending(false);
    }
  };

  const startNewBooking = () => {
    setConfirmation(null);
    setNotice(null);
    setValues(EMPTY_VALUES);
    setErrors({});
  };

  if (confirmation) {
    const { booking, customerCopy } = confirmation;
    return (
      <div className="card booking-card" aria-live="polite">
        <div className="alert alert-success" role="status">
          <strong>Booking confirmed! 🎉</strong>
          <p>
            Your booking reference is <strong>{booking.reference}</strong>. The booking email was sent successfully to
            our team.
            {customerCopy === "sent" && ` A confirmation copy was also emailed to ${booking.email}.`}
            {customerCopy === "failed" && " We could not email you a copy, so please save this reference."}
          </p>
        </div>
        <BookingSummary booking={booking} />
        <button type="button" className="btn btn-outline btn-block" onClick={startNewBooking}>
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form className="card booking-card" onSubmit={handleSubmit} noValidate>
      <h3>Book a Pickup</h3>
      <p className="muted">Fields marked * are required.</p>

      <div className="order-summary" aria-label="Order summary">
        <h4>Order summary</h4>
        {cart.items.length === 0 ? (
          <p className="muted">No services selected yet. Add services above.</p>
        ) : (
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <span>{formatINR(item.subtotal)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="order-total"><span>Total order amount</span><strong>{formatINR(cart.total)}</strong></p>
      </div>
      {cartError && <p className="error-text" role="alert">{cartError}</p>}

      <div className="form-grid">
        <Field id="booking-name" label="Full name" required error={errors.name}>
          <input type="text" autoComplete="name" {...inputProps("name")} />
        </Field>
        <Field id="booking-email" label="Email address" required error={errors.email}>
          <input type="email" autoComplete="email" {...inputProps("email")} />
        </Field>
        <Field id="booking-phone" label="Phone number" required error={errors.phone}>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="98765 43210" {...inputProps("phone")} />
        </Field>
        <Field id="booking-date" label="Preferred pickup date" required error={errors.date}>
          <input type="date" min={todayISO()} {...inputProps("date")} />
        </Field>
        <Field id="booking-time" label="Preferred pickup time" required error={errors.time}>
          <select {...inputProps("time")}>
            <option value="">Select a time</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>{slot.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="booking-address" label="Pickup address" required error={errors.address}>
        <textarea rows="3" autoComplete="street-address" {...inputProps("address")} />
      </Field>
      <Field
        id="booking-instructions"
        label="Instructions (optional)"
        error={errors.instructions}
        hint="e.g. stain locations, fabric notes, gate or landmark details."
      >
        <textarea
          rows="3"
          maxLength={500}
          {...inputProps("instructions")}
          {...fieldAria("booking-instructions", errors.instructions, true)}
        />
      </Field>

      {notice && (
        <div className={`alert ${notice.type === "error" ? "alert-error" : "alert-warn"}`} role="alert">
          <strong>{notice.type === "error" ? "Booking not sent" : "Email not configured"}</strong>
          <p>{notice.message}</p>
          <details>
            <summary>View booking details (reference {notice.booking.reference})</summary>
            <BookingSummary booking={notice.booking} />
          </details>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={sending}>
        {sending ? "Sending booking…" : "Book Now"}
      </button>
    </form>
  );
}
