/**
 * EmailJS CONFIGURATION
 * ---------------------
 * Values are read from environment variables (see .env.example).
 * Create a file named ".env" in the project root and fill in:
 *
 *   VITE_EMAILJS_PUBLIC_KEY            -> EmailJS dashboard > Account > General > Public Key
 *   VITE_EMAILJS_SERVICE_ID            -> EmailJS dashboard > Email Services
 *   VITE_EMAILJS_BOOKING_TEMPLATE_ID   -> EmailJS dashboard > Email Templates
 *   VITE_EMAILJS_CUSTOMER_TEMPLATE_ID  -> (optional) template that emails the customer
 *   VITE_EMAILJS_CONTACT_TEMPLATE_ID   -> (optional) template for the Contact form
 *
 * These IDs/public key are designed to be public. NEVER add a Private Key here.
 */
const env = import.meta.env;

export const emailConfig = {
  publicKey: env.VITE_EMAILJS_PUBLIC_KEY || "",
  serviceId: env.VITE_EMAILJS_SERVICE_ID || "",
  bookingTemplateId: env.VITE_EMAILJS_BOOKING_TEMPLATE_ID || "",
  customerTemplateId: env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID || "",
  contactTemplateId: env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || "",
};

// A value counts as "set" only if it is non-empty and not the placeholder text.
const isRealValue = (value) => Boolean(value) && !/^your_/i.test(value.trim());

export const isBookingEmailConfigured = () =>
  isRealValue(emailConfig.publicKey) &&
  isRealValue(emailConfig.serviceId) &&
  isRealValue(emailConfig.bookingTemplateId);

export const isCustomerEmailConfigured = () =>
  isBookingEmailConfigured() && isRealValue(emailConfig.customerTemplateId);

export const isContactEmailConfigured = () =>
  isRealValue(emailConfig.publicKey) &&
  isRealValue(emailConfig.serviceId) &&
  isRealValue(emailConfig.contactTemplateId);
