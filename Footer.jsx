import { brand, navLinks } from "../data/siteContent.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">🧼 {brand.name}</p>
          <p className="footer-muted">{brand.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {navLinks.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
            <li><a href="#cart">Cart &amp; Booking</a></li>
          </ul>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {brand.name}. Sample project – Tutedude Assignment 4.</p>
      </div>
    </footer>
  );
}
