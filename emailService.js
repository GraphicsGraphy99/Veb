import emailjs from "@emailjs/browser";
import { emailConfig, isCustomerEmailConfigured } from "../config/emailConfig.js";
import { formatINR, formatPickupDate, formatTimeLabel } from "../utils/format.js";

/**
 * EmailJS TEMPLATE VARIABLES used by the booking email
 * (use these exact names inside {{ }} in your EmailJS template):
 *
 *   booking_ref, customer_name, customer_email, customer_phone,
 *   pickup_address, pickup_date, pickup_time, instructions,
 *   order_details, order_total, reply_to
 *
 * The customer-copy template additionally receives: to_email
 */
function buildBookingParams(booking) {
  const orderDetails = booking.lines
    .map(
      (line, index) =>
        `${index + 1}. ${line.name} - ${line.quantity} x ${formatINR(line.price)} ${line.unit} = ${formatINR(line.subtotal)}`
    )
    .join("\n");

  return {
    booking_ref: booking.reference,
    customer_name: booking.name,
    customer_email: booking.email,
    customer_phone: booking.phone,
    pickup_address: booking.address,
    pickup_date: formatPickupDate(booking.date),
    pickup_time: formatTimeLabel(booking.time),
    instructions: booking.instructions || "None",
    order_details: orderDetails,
    order_total: formatINR(booking.total),
    reply_to: booking.email,
  };
}

/**
 * Sends the booking to the business email (required) and, if a customer
 * template is configured, a copy to the customer (optional).
 * Throws if the main email fails. Returns { customerCopy: "sent" | "failed" | "skipped" }.
 */
export async function sendBookingEmail(booking) {
  const { publicKey, serviceId, bookingTemplateId, customerTemplateId } = emailConfig;
  const params = buildBookingParams(booking);

  await emailjs.send(serviceId, bookingTemplateId, params, { publicKey });

  if (!isCustomerEmailConfigured()) return { customerCopy: "skipped" };

  try {
    await emailjs.send(serviceId, customerTemplateId, { ...params, to_email: booking.email }, { publicKey });
    return { customerCopy: "sent" };
  } catch (error) {
    console.error("Customer copy email failed:", error);
    return { customerCopy: "failed" };
  }
}

/** Contact template variables: from_name, from_email, message, reply_to */
export async function sendContactEmail({ name, email, message }) {
  const { publicKey, serviceId, contactTemplateId } = emailConfig;
  await emailjs.send(
    serviceId,
    contactTemplateId,
    { from_name: name.trim(), from_email: email.trim(), message: message.trim(), reply_to: email.trim() },
    { publicKey }
  );
}

/** Turns an EmailJS/network error into a message a student can act on. */
export function describeEmailError(error) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "You appear to be offline. Check your internet connection and try again.";
  }
  const status = error?.status;
  const text = error?.text || error?.message || "";
  if ([400, 401, 403, 404].includes(status)) {
    return `EmailJS rejected the request (${status}${text ? `: ${text}` : ""}). Check your Public Key, Service ID, Template ID and template variables.`;
  }
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  return text || "An unknown error occurred while sending the email.";
}
