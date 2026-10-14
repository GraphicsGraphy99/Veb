function WashingMachineIllustration() {
  return (
    <svg viewBox="0 0 400 440" role="img" aria-label="Illustration of a washing machine with bubbles" className="hero-illustration">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <clipPath id="drumClip"><circle cx="200" cy="250" r="72" /></clipPath>
      </defs>

      <circle cx="200" cy="225" r="185" fill="#dbeafe" />
      <circle cx="330" cy="90" r="38" fill="#ede9fe" />
      <circle cx="60" cy="340" r="26" fill="#cffafe" />

      <rect x="82" y="378" width="30" height="14" rx="5" fill="#1d4ed8" />
      <rect x="288" y="378" width="30" height="14" rx="5" fill="#1d4ed8" />
      <rect x="80" y="50" width="240" height="334" rx="28" fill="url(#bodyGrad)" stroke="#2563eb" strokeWidth="6" />
      <line x1="80" y1="125" x2="320" y2="125" stroke="#bfdbfe" strokeWidth="4" />

      <circle cx="125" cy="88" r="15" fill="#8b5cf6" />
      <rect x="125" y="84" width="14" height="4" rx="2" fill="#ffffff" />
      <rect x="165" y="70" width="95" height="32" rx="9" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="2" />
      <rect x="175" y="82" width="45" height="8" rx="4" fill="#06b6d4" />
      <circle cx="288" cy="88" r="9" fill="#06b6d4" />

      <circle cx="200" cy="250" r="96" fill="#f8fafc" stroke="#2563eb" strokeWidth="8" />
      <circle cx="200" cy="250" r="80" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="3" />
      <g clipPath="url(#drumClip)">
        <rect x="120" y="262" width="160" height="70" fill="url(#waterGrad)" opacity="0.85" />
        <path d="M120 262 q20 -16 40 0 t40 0 t40 0 t40 0 V275 H120 Z" fill="url(#waterGrad)" opacity="0.85" />
        <rect x="165" y="228" width="34" height="26" rx="8" fill="#8b5cf6" transform="rotate(-18 182 241)" />
        <rect x="205" y="238" width="30" height="24" rx="8" fill="#06b6d4" transform="rotate(14 220 250)" />
        <circle cx="175" cy="285" r="7" fill="#ffffff" opacity="0.8" />
        <circle cx="228" cy="296" r="9" fill="#ffffff" opacity="0.7" />
        <circle cx="205" cy="276" r="5" fill="#ffffff" opacity="0.9" />
      </g>
      <path d="M150 215 q20 -22 50 -22" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

      <g fill="none" stroke="#38bdf8" strokeWidth="3">
        <circle cx="345" cy="200" r="14" />
        <circle cx="365" cy="250" r="8" />
        <circle cx="45" cy="160" r="12" />
        <circle cx="28" cy="205" r="6" />
        <circle cx="350" cy="330" r="10" />
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">FreshFold Laundry</p>
          <h1>Revitalize Your Clothes with Expert Laundry Services!</h1>
          <p className="hero-text">
            From premium dry cleaning to swift wash and fold, we deliver care and convenience. Schedule a pickup and
            rediscover the freshness of your clothes today!
          </p>
          <a href="#services" className="btn btn-primary btn-lg">Book a Service Today!</a>
        </div>
        <div className="hero-art">
          <WashingMachineIllustration />
        </div>
      </div>
    </section>
  );
}
