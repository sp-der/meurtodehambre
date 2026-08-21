'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Flame,
  MapPin,
  Menu,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import StorySection from './StorySection';

type LocationKey = 'rialto' | 'lawndale';

type Location = {
  key: LocationKey;
  city: string;
  address: string;
  orderUrl: string;
};

const locations: Location[] = [
  {
    key: 'rialto',
    city: 'Rialto',
    address: '762 N Mulberry Ave, Rialto, CA 92376',
    orderUrl:
      'https://order.tryotter.com/s/muerto-de-hambre-grill/762-n-mulberry-ave%2C-rialto%2C-ca-92376%2C-usa-rialto/68b424a7-34b8-4170-ba79-96ac63d1f92d',
  },
  {
    key: 'lawndale',
    city: 'Lawndale',
    address: '16711 Hawthorne Blvd, Lawndale, CA',
    orderUrl:
      'https://order.tryotter.com/s/muerto-de-hambre-grill/16711-hawthorne-blvd-lawndale/534bb216-8cdf-4f8e-80ac-58ea85103389',
  },
];

const reveal = {
  hidden: { opacity: 0, y: 42 },
  visible: { opacity: 1, y: 0 },
};

function playFireWhoosh() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const duration = 1.35;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < channel.length; i += 1) {
      const fade = 1 - i / channel.length;
      channel[i] = (Math.random() * 2 - 1) * fade;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(180, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1450, ctx.currentTime + 0.62);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.42, ctx.currentTime + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(72, ctx.currentTime);
    rumble.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.9);
    rumbleGain.gain.setValueAtTime(0.08, ctx.currentTime);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.95);

    source.connect(filter).connect(gain).connect(ctx.destination);
    rumble.connect(rumbleGain).connect(ctx.destination);

    source.start();
    rumble.start();
    rumble.stop(ctx.currentTime + 1);
    source.stop(ctx.currentTime + duration);
  } catch {
    // Audio is enhancement-only. The visual intro still works if a browser blocks it.
  }
}

function FireIntro() {
  const [visible, setVisible] = useState(true);
  const [burning, setBurning] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem('mdh-intro-seen') === '1') {
      setVisible(false);
    }
  }, []);

  const finishIntro = () => {
    window.sessionStorage.setItem('mdh-intro-seen', '1');
    setBurning(true);
    playFireWhoosh();
    window.setTimeout(() => setVisible(false), 1650);
  };

  const skipIntro = () => {
    window.sessionStorage.setItem('mdh-intro-seen', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`intro ${burning ? 'intro-burning' : ''}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="intro-noise" />
          <div className="intro-embers" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <i key={index} style={{ '--i': index } as React.CSSProperties} />
            ))}
          </div>
          <div className="fire-sweep" aria-hidden="true">
            <span className="flame flame-one" />
            <span className="flame flame-two" />
            <span className="flame flame-three" />
            <span className="flame flame-four" />
          </div>

          <motion.div
            className="intro-content"
            animate={burning ? { scale: 1.04, opacity: 0.15 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="eyebrow">MUERTO DE HAMBRE</span>
            <div className="intro-mark">
              <Flame size={30} strokeWidth={1.6} />
            </div>
            <h1>COME HUNGRY.</h1>
            <p>Tap to ignite the grill.</p>
            <button type="button" className="ignite-button" onClick={finishIntro} disabled={burning}>
              <Flame size={18} fill="currentColor" />
              Enter Hungry
            </button>
            <button type="button" className="skip-intro" onClick={skipIntro} disabled={burning}>
              Skip intro
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [preferred, setPreferred] = useState<LocationKey | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('mdh-preferred-location') as LocationKey | null;
    if (saved === 'rialto' || saved === 'lawndale') setPreferred(saved);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const choose = (location: Location) => {
    window.localStorage.setItem('mdh-preferred-location', location.key);
    window.location.href = location.orderUrl;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close order location selector">
              <X size={22} />
            </button>
            <span className="eyebrow">ORDER ONLINE</span>
            <h2 id="order-title">WHERE ARE YOU HUNGRY?</h2>
            <p>Choose your location and we’ll send you straight to that restaurant’s live Otter menu.</p>

            <div className="location-choice-grid">
              {locations.map((location) => (
                <button className="location-choice" type="button" key={location.key} onClick={() => choose(location)}>
                  <div className="location-choice-topline">
                    <MapPin size={20} />
                    {preferred === location.key && <span className="last-used">Last used</span>}
                  </div>
                  <strong>{location.city}</strong>
                  <span>{location.address}</span>
                  <div className="choice-cta">
                    Order {location.city}
                    <ArrowRight size={18} />
                  </div>
                </button>
              ))}
            </div>

            <small>Pickup, delivery, menu availability and checkout continue securely through Otter.</small>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ onOrder }: { onOrder: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = useMemo(
    () => [
      { label: 'Story', href: '#story' },
      { label: 'Favorites', href: '#favorites' },
      { label: 'Catering', href: '#catering' },
      { label: 'Locations', href: '#locations' },
    ],
    [],
  );

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Muerto De Hambre Grill home">
        <span>MUERTO</span>
        <small>DE HAMBRE GRILL</small>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <button className="order-button order-button-header" type="button" onClick={onOrder}>
        Order Online
        <Flame size={16} fill="currentColor" />
      </button>

      <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">
        {menuOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <button type="button" onClick={() => { setMenuOpen(false); onOrder(); }}>
              Order Online
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function SiteExperience() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <FireIntro />
      <Header onOrder={() => setOrderOpen(true)} />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />

      <main id="top">
        <section className="hero">
          <div className="hero-photo" />
          <div className="hero-shade" />
          <div className="hero-grain" />

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
          >
            <span className="eyebrow">RIALTO · LAWNDALE</span>
            <h1>
              BUILT FOR
              <span>SERIOUS HUNGER.</span>
            </h1>
            <p>
              Big flavor, hot grills, and a menu made to hit. Welcome to Muerto De Hambre.
            </p>
            <div className="hero-actions">
              <button type="button" className="order-button hero-order" onClick={() => setOrderOpen(true)}>
                Order Online
                <ArrowRight size={19} />
              </button>
              <a className="ghost-button" href="#favorites">
                Explore the vibe
              </a>
            </div>
          </motion.div>

          <a className="scroll-cue" href="#favorites" aria-label="Scroll to featured section">
            Scroll
            <ChevronDown size={18} />
          </a>
        </section>

        <section className="ticker" aria-label="Restaurant highlights">
          <div className="ticker-track">
            {['MUERTO DE HAMBRE', 'RIALTO', 'COME HUNGRY', 'LAWNDALE', 'ORDER ONLINE', 'FRESH OFF THE GRILL'].map((item) => (
              <span key={item}>{item}<i>✦</i></span>
            ))}
            {['MUERTO DE HAMBRE', 'RIALTO', 'COME HUNGRY', 'LAWNDALE', 'ORDER ONLINE', 'FRESH OFF THE GRILL'].map((item) => (
              <span key={`repeat-${item}`}>{item}<i>✦</i></span>
            ))}
          </div>
        </section>

        <section className="section favorites" id="favorites">
          <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.62 }}>
            <span className="eyebrow">THE FIRST BITE</span>
            <h2>FOOD SHOULD LOOK<br />THIS LOUD.</h2>
            <p>These are temporary visual placeholders until we drop in Hambre’s real photography and menu favorites.</p>
          </motion.div>

          <div className="food-grid">
            <motion.article className="food-card food-card-large food-one" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
              <div className="food-card-overlay" />
              <div className="food-copy">
                <span>01</span>
                <h3>Signature Plates</h3>
                <p>Hero-worthy plates belong here.</p>
              </div>
            </motion.article>

            <motion.article className="food-card food-two" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.08 }}>
              <div className="food-card-overlay" />
              <div className="food-copy">
                <span>02</span>
                <h3>Grill Favorites</h3>
                <p>Char, crunch, sauce, repeat.</p>
              </div>
            </motion.article>

            <motion.article className="food-card food-three" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.14 }}>
              <div className="food-card-overlay" />
              <div className="food-copy">
                <span>03</span>
                <h3>Hambre Favorites</h3>
                <p>The dishes regulars come back for.</p>
              </div>
            </motion.article>
          </div>
        </section>

        <StorySection />

        <section className="section order-callout">
          <motion.div className="order-callout-inner" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.62 }}>
            <Flame className="callout-flame" size={46} strokeWidth={1.3} />
            <span className="eyebrow">SKIP THE SCROLL</span>
            <h2>HUNGRY ALREADY?</h2>
            <p>Choose Rialto or Lawndale and jump straight into the live ordering menu.</p>
            <button type="button" className="order-button callout-button" onClick={() => setOrderOpen(true)}>
              Choose a location
              <ArrowRight size={19} />
            </button>
          </motion.div>
        </section>

        <section className="catering" id="catering">
          <div className="catering-photo" />
          <div className="catering-shade" />
          <motion.div className="catering-content" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}>
            <span className="eyebrow">FEED THE WHOLE CREW</span>
            <h2>CATERING,<br />HOMBRE.</h2>
            <p>Built as a future lead-generation section once we confirm Hambre’s catering packages, party sizes, and inquiry process.</p>
            <a className="ghost-button light" href="#locations">Ask your location</a>
          </motion.div>
        </section>

        <section className="section locations-section" id="locations">
          <motion.div className="section-heading centered" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">TWO SPOTS. SAME HUNGER.</span>
            <h2>FIND YOUR HAMBRE.</h2>
          </motion.div>

          <div className="location-grid">
            {locations.map((location, index) => (
              <motion.article
                className="location-card"
                key={location.key}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.58, delay: index * 0.08 }}
              >
                <div className={`location-photo ${location.key}`} />
                <div className="location-card-body">
                  <MapPin size={18} />
                  <span>CALIFORNIA</span>
                  <h3>{location.city}</h3>
                  <p>{location.address}</p>
                  <button type="button" onClick={() => {
                    window.localStorage.setItem('mdh-preferred-location', location.key);
                    window.location.href = location.orderUrl;
                  }}>
                    Order this location <ArrowRight size={18} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-mark">
          <UtensilsCrossed size={26} />
          <strong>MUERTO DE HAMBRE</strong>
          <span>GRILL</span>
        </div>
        <div className="footer-links">
          <a href="#favorites">Food</a>
          <a href="#story">Story</a>
          <a href="#locations">Locations</a>
          <button type="button" onClick={() => setOrderOpen(true)}>Order Online</button>
        </div>
        <p>Rialto · Lawndale · California</p>
      </footer>

      <button className="mobile-order-sticky" type="button" onClick={() => setOrderOpen(true)}>
        <Flame size={17} fill="currentColor" />
        Order Online
      </button>
    </>
  );
}
