import { formatTimeLabel, todayISO } from "./format.js";

// One-hour pickup slots from 9:00 AM to 6:00 PM.
export const TIME_SLOTS = Array.from({ length: 10 }, (_, index) => {
  const value = `${String(9 + index).padStart(2, "0")}:00`;
  return { value, label: formatTimeLabel(value) };
});

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion

/** Example: FF-20261014-K7P3Q */
export function generateBookingRef(now = new Date()) {
  const stamp = todayISO(now).replaceAll("-", "");
  const bytes = new Uint8Array(5);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256)));
  const suffix = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `FF-${stamp}-${suffix}`;
}

/** Builds the booking object that is shown on screen and sent by email. */
export function createBooking(values, cartItems, total) {
  return {
    reference: generateBookingRef(),
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    date: values.date,
    time: values.time,
    instructions: values.instructions.trim(),
    lines: cartItems.map(({ id, name, price, unit, quantity, subtotal }) => ({
      id,
      name,
      price,
      unit,
      quantity,
      subtotal,
    })),
    total,
  };
}
