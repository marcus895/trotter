"use client";

import { useState, useEffect, useRef } from "react";

const HERO_CITIES = [
  "Tokyo", "Bali", "Paris", "Santorini", "New York", "Kyoto", "Dubai", "Maldives",
  "Barcelona", "Rome", "Lisbon", "Iceland", "Prague", "Mykonos", "Positano",
  "Cape Town", "Bangkok", "Florence", "Dubrovnik", "Hawaii", "Havana",
  "Fiji", "Marrakech", "Vienna", "Patagonia", "Zanzibar", "Tuscany", "Seychelles",
];

const BUILDER_STEPS = [
  "Finding best flights...",
  "Comparing hotels...",
  "Discovering local experiences...",
  "Checking visa requirements...",
  "Your plan is ready ✓",
];

const CARD_LINES = [
  { icon: "✈️", text: "LHR → NRT · £487 pp · Non-stop" },
  { icon: "🏨", text: "Park Hyatt Tokyo · 6 nights" },
  { icon: "🍜", text: "Ramen tour · Shibuya & Shinjuku" },
  { icon: "🌸", text: "Shinjuku Gyoen · Cherry blossoms" },
  { icon: "⛩️", text: "Asakusa temple · guided tour" },
  { icon: "🗻", text: "Day trip · Mt Fuji & Hakone" },
  { icon: "💴", text: "Total estimate · £2,840 pp" },
];

interface TripFormData {
  destination: string;
  dateFrom: string;
  dateTo: string;
  travellers: number;
  budget: string;
  email: string;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [builderStep, setBuilderStep] = useState(0);
  const [slotCity, setSlotCity] = useState(HERO_CITIES[0]);
  const [slotKey, setSlotKey] = useState(0);
  const [slotDone, setSlotDone] = useState(false);
  const [slotDuration, setSlotDuration] = useState(60);
  const [cardLine, setCardLine] = useState(0);
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    dateFrom: "",
    dateTo: "",
    travellers: 1,
    budget: "",
    email: "",
  });
  const navRef = useRef<HTMLElement>(null);

  function handleTripSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep(2);
  }

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.style.boxShadow =
        window.scrollY > 50
          ? "0 2px 20px rgba(13,27,42,0.1)"
          : "0 1px 12px rgba(13,27,42,0.06)";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (step !== 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll<HTMLElement>(".step, .feature-card").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition =
        "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [step]);

  useEffect(() => {
    if (step !== 0) return;
    const delay = builderStep >= BUILDER_STEPS.length ? 2200 : 1800;
    const timer = setTimeout(() => {
      setBuilderStep((s) => (s >= BUILDER_STEPS.length ? 0 : s + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [step, builderStep]);

  useEffect(() => {
    if (step !== 0) return;
    const delays: number[] = [];
    let d = 90;
    while (d < 420) { delays.push(Math.round(d)); d *= 1.13; }
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 0;
    delays.forEach((delay, i) => {
      cumulative += delay;
      const city = HERO_CITIES[(i + 1) % HERO_CITIES.length];
      const dur = Math.min(Math.round(delay * 0.7), 260);
      timeouts.push(setTimeout(() => {
        setSlotCity(city);
        setSlotKey((k) => k + 1);
        setSlotDuration(dur);
      }, cumulative));
    });
    timeouts.push(setTimeout(() => {
      setSlotDone(true);
      setSlotKey((k) => k + 1);
    }, cumulative + delays[delays.length - 1]));
    return () => timeouts.forEach(clearTimeout);
  }, [step]);

  useEffect(() => {
    if (step !== 0) return;
    if (cardLine >= CARD_LINES.length) {
      const t = setTimeout(() => setCardLine(0), 2500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCardLine((l) => l + 1), 900);
    return () => clearTimeout(t);
  }, [step, cardLine]);

  const budgetOptions = ["Budget", "Mid-range", "Premium", "Luxury"];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1.25rem",
    background: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--midnight)",
    fontSize: "0.95rem",
    outline: "none",
    boxShadow: "0 1px 4px rgba(13,27,42,0.05)",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--midnight)",
    marginBottom: "0.5rem",
    letterSpacing: "0.02em",
  };

  return (
    <>
      {/* ── NAV ── */}
      <nav ref={navRef}>
        <div className="nav-logo">
          Tro<span>tt</span>er
        </div>
        {step === 0 && (
          <>
            <ul className="nav-links">
              <li><a href="#how">How it works</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">My Trips</a></li>
            </ul>
            <button className="nav-cta" onClick={() => setStep(1)}>
              Create my dream trip
            </button>
          </>
        )}
      </nav>

      {/* ── STEP 0: LANDING PAGE ── */}
      {step === 0 && (
        <>
          {/* ── HERO ── */}
          <section className="hero" id="home">
            <div className="hero-grid">
              {/* LEFT: text content */}
              <div className="hero-left">
                <div className="hero-badge">AI-Powered Travel Planning</div>
                <h1>
                  <span style={{ whiteSpace: "nowrap" }}>From your front door</span>
                  <br />
                  <em>
                    <span style={{ color: "#0D1B2A" }}>to </span>
                    <span
                      key={slotKey}
                      style={{
                        display: "inline-block",
                        color: "var(--amber)",
                        animation: slotDone
                          ? "slotLand 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                          : `slotSpin ${slotDuration}ms ease-out forwards`,
                      }}
                    >
                      {slotDone ? "the world" : slotCity}
                    </span>
                    <span style={{ color: "#0D1B2A" }}>.</span>
                  </em>
                </h1>
                <p className="hero-tagline">
                  <strong>Your personal travel planner</strong>
                  <br />
                  Tell Trotter where you want to go, when, and your budget.
                  It asks you the right questions — then builds your perfect trip
                  and delivers the complete plan straight to your inbox.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setStep(1)}
                  style={{ fontSize: "1.15rem", padding: "1.1rem 2.75rem" }}
                >
                  Create my dream trip →
                </button>
              </div>

              {/* RIGHT: animated trip card */}
              <div className="hero-right">
                <div className="trip-card">
                  <div className="trip-card-header">
                    <div className="trip-card-dest">Tokyo · Japan</div>
                    <div className="trip-card-title">7 days in Tokyo</div>
                    <div className="trip-card-dates">March 15 – 22, 2025</div>
                  </div>
                  <div className="trip-card-status">
                    <span className="live-dot" style={{ width: "7px", height: "7px" }} />
                    Trotter AI · Building your plan
                  </div>
                  <div className="trip-card-body">
                    {CARD_LINES.slice(0, cardLine).map((line, i) => (
                      <div key={i} className="trip-card-line">
                        <div className="trip-card-line-icon">{line.icon}</div>
                        <span className="trip-card-line-text">{line.text}</span>
                      </div>
                    ))}
                    {cardLine < CARD_LINES.length && (
                      <div className="trip-card-line">
                        <div className="trip-card-line-icon" style={{ opacity: 0.25 }}>·</div>
                        <span className="trip-card-line-text"><span className="card-cursor" /></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="how" id="how">
            <div className="how-header">
              <span className="section-label">Simple by design</span>
              <h2 className="section-title">Travel planning<br />in three steps</h2>
              <p className="section-sub">
                No more juggling 12 browser tabs. Trotter is your concierge — it plans,
                recommends, and guides you to exactly where you need to go.
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <span className="step-icon">💬</span>
                <h3>Tell us your dream</h3>
                <p>
                  Describe your ideal trip in plain language. Destination, budget, vibe,
                  travel dates — or just say &quot;surprise me.&quot; Trotter listens and learns.
                </p>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <span className="step-icon">✨</span>
                <h3>AI builds your itinerary</h3>
                <p>
                  Trotter&apos;s AI crafts a full itinerary — finding the best flights,
                  accommodation, activities, and restaurants — curated for your preferences
                  and budget.
                </p>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <span className="step-icon">🌍</span>
                <h3>Head straight there</h3>
                <p>
                  Review your curated itinerary and make it yours. When you&apos;re ready,
                  Trotter sends you the complete travel package directly in your inbox and
                  will help you book the entire trip — no hunting, no extra tabs.
                </p>
              </div>
            </div>
          </section>

          {/* ── LIVE BUILDER ── */}
          <section className="builder-section">
            <div className="builder-inner">
              <div>
                <span className="section-label" style={{ color: "rgba(244,162,40,0.75)" }}>
                  See it in action
                </span>
                <h2 style={{
                  fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)",
                  fontWeight: 800,
                  color: "var(--white)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                }}>
                  Your trip, built<br />in seconds
                </h2>
                <p style={{
                  fontSize: "1.05rem",
                  color: "rgba(245,240,232,0.55)",
                  lineHeight: 1.75,
                  maxWidth: "400px",
                }}>
                  Watch Trotter&apos;s AI handle every detail — flights, hotels,
                  experiences, and logistics — all at once, so you can focus
                  on the excitement ahead.
                </p>
              </div>

              <div className="builder-card">
                {/* header */}
                <div className="builder-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--cream)", letterSpacing: "0.01em" }}>
                    <span className="live-dot" style={{ width: "8px", height: "8px" }} />
                    Trotter AI
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--amber)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {builderStep >= BUILDER_STEPS.length ? "Complete ✓" : "Building…"}
                  </span>
                </div>

                {/* progress bar */}
                <div className="builder-progress-bar">
                  <div style={{
                    height: "100%",
                    background: "linear-gradient(90deg, var(--amber), #FFD080)",
                    width: `${builderStep >= BUILDER_STEPS.length ? 100 : (builderStep / BUILDER_STEPS.length) * 100}%`,
                    transition: "width 0.6s ease",
                    borderRadius: "0 2px 2px 0",
                  }} />
                </div>

                {/* steps */}
                <div className="builder-steps-list">
                  {BUILDER_STEPS.map((label, i) => {
                    const allDone = builderStep >= BUILDER_STEPS.length;
                    const done = allDone || i < builderStep;
                    const active = !allDone && i === builderStep;
                    return (
                      <div key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        padding: "0.65rem 0.5rem",
                        borderRadius: "10px",
                        background: active ? "rgba(244,162,40,0.07)" : "transparent",
                        transition: "background 0.4s",
                      }}>
                        <div style={{
                          width: "22px", height: "22px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.68rem", fontWeight: 800,
                          background: done ? "rgba(244,162,40,0.18)" : active ? "var(--amber)" : "rgba(255,255,255,0.06)",
                          color: done ? "var(--amber)" : "transparent",
                          animation: active ? "pulse 1.4s ease-in-out infinite" : "none",
                          transition: "background 0.4s, color 0.4s",
                        }}>
                          {done ? "✓" : ""}
                        </div>
                        <span style={{
                          fontSize: "0.88rem",
                          fontWeight: active ? 600 : 400,
                          color: done
                            ? "rgba(245,240,232,0.3)"
                            : active
                            ? "var(--cream)"
                            : "rgba(245,240,232,0.2)",
                          transition: "color 0.4s, font-weight 0.2s",
                        }}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section id="features">
            <div className="features-header">
              <div>
                <span className="section-label">Why Trotter</span>
                <h2 className="section-title">Built for the way<br />you actually travel</h2>
              </div>
              <p className="section-sub" style={{ alignSelf: "start", marginTop: "0.5rem" }}>
                From solo adventures to family expeditions, Trotter adapts to every traveler.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card featured">
                <div>
                  <div className="feature-icon-wrap">🏠</div>
                  <h3>Your journey starts at home</h3>
                  <p>
                    Trotter plans everything before you even leave — from whether it&apos;s
                    cheaper to drive, take the train, or get a taxi to the airport, to where
                    you should park and which transport apps to download for your destination.
                  </p>
                  <ul style={{ listStyle: "none", marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                      <span style={{ color: "var(--amber)", fontSize: "0.9rem" }}>✓</span> Door-to-airport logistics
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                      <span style={{ color: "var(--amber)", fontSize: "0.9rem" }}>✓</span> Parking vs. transit comparison
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                      <span style={{ color: "var(--amber)", fontSize: "0.9rem" }}>✓</span> Local transport apps recommended
                    </li>
                  </ul>
                </div>
                <div className="feature-visual">
                  <div className="feature-visual-inner">
                    <div style={{ fontSize: "0.72rem", color: "var(--amber)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      YOUR TRAVEL PROFILE
                    </div>
                    <div className="vis-bar" />
                    <div className="vis-bar" />
                    <div className="vis-bar" />
                    <div className="vis-bar" />
                    <div className="vis-bar" />
                    <div className="vis-dots">
                      <div className="vis-dot active" />
                      <div className="vis-dot active" />
                      <div className="vis-dot active" />
                      <div className="vis-dot" />
                      <div className="vis-dot" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">🛂</div>
                <h3>Visa &amp; entry requirements</h3>
                <p>
                  Trotter checks if you need a visa or ESTA, tells you exactly what it costs,
                  and links you directly to the official application — no searching, no guessing.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">💉</div>
                <h3>Health &amp; vaccinations</h3>
                <p>
                  Know exactly which vaccines are recommended before you travel. Trotter links
                  you directly to book a travel health appointment — so you&apos;re covered
                  before you go.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">🤝</div>
                <h3>Your personal trip concierge</h3>
                <p>
                  Once your plan is ready, a dedicated AI assistant is built around your
                  specific itinerary. Ask it anything while you&apos;re away — it knows your
                  flights, your hotels, your plans, and the local weather.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">📶</div>
                <h3>eSIM &amp; connectivity</h3>
                <p>
                  Stay connected from the moment you land. Trotter recommends the best eSIM
                  for your destination and links you directly to activate it before you fly.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">🎭</div>
                <h3>Events &amp; experiences</h3>
                <p>
                  Trotter finds what&apos;s happening at your destination during your stay —
                  concerts, markets, local festivals — and recommends activities matched to
                  your personal interests and travel style.
                </p>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer>
            <div className="footer-top">
              <div className="footer-brand">
                <div className="nav-logo" style={{ fontSize: "1.4rem" }}>
                  Tro<span style={{ color: "var(--amber)" }}>tt</span>er
                </div>
                <p>
                  Your personal AI travel planner. Trotter finds the best flights, hotels,
                  and experiences — then sends you directly to the right place to book.
                  Premium guidance, zero friction.
                </p>
                <div className="footer-social">
                  <a href="#" className="social-btn" aria-label="Twitter">𝕏</a>
                  <a href="#" className="social-btn" aria-label="Instagram">◻</a>
                  <a href="#" className="social-btn" aria-label="LinkedIn">in</a>
                </div>
              </div>

              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#">How it works</a></li>
                  <li><a href="#">Features</a></li>
                  <li><a href="#">Pricing</a></li>
                  <li><a href="#">Enterprise</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Press</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© 2026 Trotter Technologies, Inc. All rights reserved.</span>
              <span>Made with ♥ for curious travelers everywhere</span>
            </div>
          </footer>
        </>
      )}

      {/* ── STEP 1: TRIP BUILDER FORM ── */}
      {step === 1 && (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "7rem 5% 5rem",
          background: "var(--cream)",
        }}>
          <div style={{ width: "100%", maxWidth: "560px" }}>
            <button
              onClick={() => setStep(0)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>

            <div className="hero-badge" style={{ marginBottom: "1.25rem" }}>
              AI-Powered Travel Planning
            </div>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--midnight)",
              letterSpacing: "-0.03em",
              marginBottom: "0.5rem",
              lineHeight: 1.1,
            }}>
              Let&apos;s plan your trip
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "2.25rem" }}>
              Tell us the basics and we&apos;ll handle the rest.
            </p>

            <form onSubmit={handleTripSubmit}>
              {/* Where do you want to go? */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Where do you want to go?</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Tokyo, Japan"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Travel dates */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Travel dates</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ ...labelStyle, fontSize: "0.76rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                      From
                    </label>
                    <input
                      type="date"
                      value={formData.dateFrom}
                      onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: "0.76rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                      To
                    </label>
                    <input
                      type="date"
                      value={formData.dateTo}
                      onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* How many travellers? */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>How many travellers?</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.travellers}
                  onChange={(e) => setFormData({ ...formData, travellers: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                  required
                  style={{ ...inputStyle, maxWidth: "160px" }}
                />
              </div>

              {/* Budget */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>What is your budget?</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.6rem" }}>
                  {budgetOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: option })}
                      style={{
                        padding: "0.85rem 0.4rem",
                        border: formData.budget === option
                          ? "2px solid var(--amber)"
                          : "1px solid var(--border)",
                        borderRadius: "12px",
                        background: formData.budget === option
                          ? "rgba(244,162,40,0.08)"
                          : "var(--white)",
                        color: formData.budget === option
                          ? "var(--amber-dark)"
                          : "var(--midnight)",
                        fontWeight: formData.budget === option ? 700 : 500,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                        boxShadow: formData.budget === option
                          ? "0 0 0 3px rgba(244,162,40,0.12)"
                          : "0 1px 4px rgba(13,27,42,0.05)",
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={labelStyle}>Your email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", fontSize: "1.05rem", padding: "1rem 1.75rem" }}
              >
                Build my trip →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STEP 2: PERSONALISING ── */}
      {step === 2 && (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "7rem 5% 5rem",
          background: "var(--cream)",
        }}>
          <div style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "3.5rem 3rem",
            textAlign: "center",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 8px 40px rgba(13,27,42,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.6rem", marginBottom: "2.25rem" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="live-dot"
                  style={{ width: "14px", height: "14px", animationDelay: `${i * 0.35}s` }}
                />
              ))}
            </div>

            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              fontWeight: 800,
              color: "var(--midnight)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "0.85rem",
            }}>
              Personalising your experience
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "2.75rem" }}>
              Smart preference matching — coming soon
            </p>

            <button
              onClick={() => setStep(1)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "50px",
                padding: "0.65rem 1.5rem",
                color: "var(--text-muted)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

    </>
  );
}
