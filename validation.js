import { todayISO } from "./format.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Indian mobile numbers: optional +91 / 91 / 0 prefix, then 10 digits starting 6-9.
const PHONE_PATTERN = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const isValidEmail = (value) => EMAIL_PATTERN.test(value.trim());
export const isValidPhone = (value) => PHONE_PATTERN.test(value.replace(/[\s-]/g, ""));

/** Returns an object of { fieldName: "error message" }. Empty object = valid. */
export function validateBooking(values, now = new Date()) {
  const errors = {};

  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";

  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!isValidEmail(values.email)) errors.email = "Please enter a valid email address.";

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!isValidPhone(values.phone))
    errors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 98765 43210).";

  if (values.address.trim().length < 10)
    errors.address = "Please enter your full pickup address (at least 10 characters).";

  if (!values.date) {
    errors.date = "Please choose a pickup date.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(Date.parse(values.date))) {
    errors.date = "Please enter a valid date.";
  } else if (values.date < todayISO(now)) {
    errors.date = "Pickup date cannot be in the past.";
  }

  if (!values.time) {
    errors.time = "Please choose a pickup time.";
  } else if (!errors.date && values.date === todayISO(now)) {
    const slot = new Date(`${values.date}T${values.time}:00`);
    if (slot <= now) errors.time = "That time has already passed today. Choose a later slot.";
  }

  if (values.instructions.length > 500)
    errors.instructions = "Instructions must be 500 characters or fewer.";

  return errors;
}

export function validateContact(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!isValidEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 10) errors.message = "Please write a message of at least 10 characters.";
  else if (values.message.length > 1000) errors.message = "Message must be 1000 characters or fewer.";
  return errors;
}
