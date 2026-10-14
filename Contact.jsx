import { useState } from "react";
import Field, { fieldAria } from "./Field.jsx";
import { contactInfo } from "../data/siteContent.js";
import { validateContact } from "../utils/validation.js";
import { isContactEmailConfigured } from "../config/emailConfig.js";
import { sendContactEmail, describeEmailError } from "../services/emailService.js";

const EMPTY = { name: "", email: "", message: "" };
const ALERT_CLASS = { success: "alert-success", error: "alert-error", demo: "alert-warn" };

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const inputProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    ...fieldAria(`contact-${name}`, errors[name]),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status.type === "sending") return;

    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    if (!isContactEmailConfigured()) {
      setStatus({
        type: "demo",
        text: "Demo mode: your message passed validation but was NOT sent, because the contact email template is not configured (see README).",
      });
      return;
    }

    setStatus({ type: "sending", text: "" });
    try {
      await sendContactEmail(values);
      setStatus({ type: "success", text: "Thank you! Your message was sent successfully. We'll get back to you soon." });
      setValues(EMPTY);
    } catch (error) {
      console.error("Contact email failed:", error);
      setStatus({ type: "error", text: `We couldn't send your message. ${describeEmailError(error)}` });
    }
  };

  const showAlert = ["success", "error", "demo"].includes(status.type);

  return (
    <section id="contact" className="section section-soft">
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">Get in touch</p>
          <h2>Contact Us</h2>
          <p>Questions about a service or an order? Send us a message.</p>
        </header>

        <div className="contact-grid">
          <div className="card contact-info">
            <h3>Visit or call</h3>
            <p className="sample-note">Placeholder details – replace with your real business information.</p>
            <ul className="info-list">
              <li><strong>Phone:</strong> {contactInfo.phone} <em>(placeholder)</em></li>
              <li><strong>Email:</strong> {contactInfo.email} <em>(placeholder)</em></li>
              <li><strong>Address:</strong> {contactInfo.address}</li>
            </ul>
            <h4>Business hours</h4>
            <ul className="info-list">
              {contactInfo.hours.map((row) => (
                <li key={row.days}><strong>{row.days}:</strong> {row.time}</li>
              ))}
            </ul>
            <h4>Pickup &amp; delivery</h4>
            <p className="muted">{contactInfo.pickupInfo}</p>
          </div>

          <form className="card" onSubmit={handleSubmit} noValidate>
            <h3>Send a message</h3>
            <Field id="contact-name" label="Name" required error={errors.name}>
              <input type="text" autoComplete="name" {...inputProps("name")} />
            </Field>
            <Field id="contact-email" label="Email" required error={errors.email}>
              <input type="email" autoComplete="email" {...inputProps("email")} />
            </Field>
            <Field id="contact-message" label="Message" required error={errors.message}>
              <textarea rows="5" {...inputProps("message")} />
            </Field>

            {showAlert && (
              <div className={`alert ${ALERT_CLASS[status.type]}`} role={status.type === "error" ? "alert" : "status"}>
                <p>{status.text}</p>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={status.type === "sending"}>
              {status.type === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
