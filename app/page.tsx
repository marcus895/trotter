"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [toastVisible, setToastVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setToastVisible(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setToastVisible(false), 3500);
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
  }, []);

  return (
    <>
      {/* ── NAV ── */}
      <nav ref={navRef}>
        <div className="nav-logo">
          Tro<span>tt</span>er
        </div>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
        <a href="#waitlist" className="nav-cta">Join Waitlist</a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Travel Planning</div>
          <h1>
            <span style={{ whiteSpace: "nowrap" }}>From your front door</span><br /><em>to the world.</em>
          </h1>
          <p className="hero-tagline">
            <strong>Your personal travel planner</strong>
            <br />
            Tell Trotter where you want to go, when, and your budget.
            It asks you the right questions — then builds your perfect trip
            and delivers the complete plan straight to you and your travel companions inbox.
          </p>

          <form className="hero-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit" className="btn-primary">Get Early Access</button>
          </form>
          <p className="hero-note">Free during beta &nbsp;·&nbsp; No credit card required</p>

          <p className="hero-launch">
            567 already signed up <span className="live-dot" />
          </p>
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

      {/* ── CTA BAND ── */}
      <section className="cta-band" id="waitlist">
        <div className="geo-ring geo-ring-1" />
        <div className="geo-ring geo-ring-2" />
        <span className="section-label">Early access</span>
        <h2>Your next adventure<br />starts here.</h2>
        <p>Join 567 travelers already on the waitlist. Be first to explore.</p>
        <form className="cta-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="your@email.com" required />
          <button type="submit" className="btn-primary">Reserve My Spot</button>
        </form>
        <p className="cta-note">Free forever for early members &nbsp;·&nbsp; No spam, ever</p>
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

      {/* ── TOAST ── */}
      <div className={`toast${toastVisible ? " show" : ""}`}>
        You&apos;re on the list! We&apos;ll be in touch. ✈
      </div>
    </>
  );
}
