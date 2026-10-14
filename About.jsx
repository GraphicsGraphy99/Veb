import { aboutContent } from "../data/siteContent.js";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">About Us</p>
          <h2>{aboutContent.heading}</h2>
          <p>{aboutContent.intro}</p>
        </header>
        <div className="feature-grid">
          {aboutContent.features.map((feature) => (
            <article className="card feature-card" key={feature.title}>
              <div className="service-icon" aria-hidden="true">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p className="muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
