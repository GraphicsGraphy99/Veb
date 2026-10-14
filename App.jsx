import { useCart } from "./hooks/useCart.js";
import { useToast } from "./hooks/useToast.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import Services from "./components/Services.jsx";
import Cart from "./components/Cart.jsx";
import BookingForm from "./components/BookingForm.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const cart = useCart();
  const { message, notify } = useToast();

  const handleAdd = (service, quantity) => {
    cart.addItem(service.id, quantity);
    notify(`Added ${quantity} × ${service.name} to your cart.`);
  };

  const handleChangeQuantity = (id, quantity) => cart.setQuantity(id, quantity);

  const handleRemove = (item) => {
    cart.removeItem(item.id);
    notify(`Removed ${item.name} from your cart.`);
  };

  const goToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.getElementById("booking-name")?.focus({ preventScroll: true }), 600);
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header cartCount={cart.count} />
      <main id="main">
        <Hero />
        <Stats />
        <Services onAdd={handleAdd} />

        <section id="cart" className="section section-soft">
          <div className="container">
            <header className="section-heading">
              <p className="eyebrow">Almost there</p>
              <h2>Your Cart &amp; Pickup Booking</h2>
              <p>Review your services, then tell us when and where to pick them up.</p>
            </header>
            <div className="checkout-grid">
              <Cart
                cart={cart}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onProceed={goToBooking}
              />
              <div id="booking">
                <BookingForm cart={cart} onConfirmed={notify} />
              </div>
            </div>
          </div>
        </section>

        <About />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Toast message={message} />
    </>
  );
}
