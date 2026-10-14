import { services } from "../data/services.js";
import ServiceCard from "./ServiceCard.jsx";

export default function Services({ onAdd }) {
  return (
    <section id="services" className="section">
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">What we do</p>
          <h2>Our Services</h2>
          <p>Choose the care your clothes need, set a quantity and add it to your cart.</p>
          <p className="sample-note">ℹ️ Prices are illustrative sample prices for this demo project.</p>
        </header>
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}
