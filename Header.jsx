import { useEffect, useState } from "react";
import { brand, navLinks } from "../data/siteContent.js";

export default function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="brand" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">🧼</span>
          {brand.name}
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-bars" aria-hidden="true" />
        </button>

        <nav id="primary-nav" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>{link.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href="#cart" className="cart-link" onClick={closeMenu}>
              <span aria-hidden="true">🧺</span> Cart
              <span className="badge" aria-label={`${cartCount} items in cart`}>{cartCount}</span>
            </a>
            <a href="#booking" className="btn btn-primary btn-sm" onClick={closeMenu}>Book Now</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
