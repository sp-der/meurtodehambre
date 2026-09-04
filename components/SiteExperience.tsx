'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera as Instagram, ChevronDown, Flame, MapPin, Menu, Send, UtensilsCrossed, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import StorySection from './StorySection';
import { locations, type LocationKey, type RestaurantLocation } from '../lib/locations';

const INSTAGRAM_URL = 'https://www.instagram.com/muertodehambregrill/';
const CATERING_EMAIL = 'muertodehambreinc@gmail.com';
const reveal = { hidden: { opacity: 0, y: 42 }, visible: { opacity: 1, y: 0 } };
const mapEmbedUrl = (query: string) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const eventPhotos = [
  ['/gallery/events/dsc-2071.webp', 'Serving from the Muerto De Hambre food truck'],
  ['/gallery/events/dsc-2084.webp', 'Guests ordering at the Muerto De Hambre food truck'],
  ['/gallery/events/dsc-2151.webp', 'Muerto De Hambre food and drinks at an event'],
  ['/gallery/events/dsc-2167.webp', 'Friends sharing a Muerto De Hambre meal'],
  ['/gallery/events/dsc-2179.webp', 'A guest enjoying the Muerto De Hambre experience'],
  ['/gallery/events/dsc-2180.webp', 'Muerto De Hambre food served at a community event'],
  ['/gallery/events/dsc-5227.webp', 'Muerto De Hambre community moment'],
  ['/gallery/events/dsc-5275.webp', 'Muerto De Hambre event celebration'],
  ['/gallery/events/dsc-5302.webp', 'The Muerto De Hambre food truck in action'],
  ['/gallery/events/dsc-5331.webp', 'A spread of Muerto De Hambre favorites'],
] as const;

const foodPhotos = [
  ['/gallery/food/food-01.webp', 'Loaded Muerto De Hambre sushi tacos'],
  ['/gallery/food/food-02.webp', 'Fresh Muerto De Hambre bowl'],
  ['/gallery/food/food-03.webp', 'Muerto De Hambre fusion noodles'],
  ['/gallery/food/food-04.webp', 'Sauced Muerto De Hambre sushi tacos'],
  ['/gallery/food/food-05.webp', 'Muerto De Hambre plates ready to serve'],
  ['/gallery/food/food-06.webp', 'Colorful Muerto De Hambre fusion bowl'],
  ['/gallery/food/food-07.webp', 'Loaded Muerto De Hambre bowl'],
] as const;

function PhotoCarousel({
  images,
  label,
  variant = 'event',
  reverse = false,
}: {
  images: readonly (readonly [string, string])[];
  label: string;
  variant?: 'event' | 'food';
  reverse?: boolean;
}) {
  const carouselRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const mobile = window.matchMedia('(max-width: 650px)');
    let animationFrame = 0;
    let previousTime = 0;
    let loopWidth = 0;

    const measure = () => {
      const track = carousel.querySelector<HTMLElement>('.photo-carousel-track');
      const group = carousel.querySelector<HTMLElement>('.photo-carousel-group');
      if (!track || !group) return;

      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      loopWidth = group.getBoundingClientRect().width + gap;
      carousel.scrollLeft = reverse ? loopWidth : 0;
    };

    const move = (time: number) => {
      if (!mobile.matches) return;
      if (!previousTime) previousTime = time;

      const elapsed = Math.min(time - previousTime, 50);
      const pixelsPerSecond = variant === 'event' ? 42 : 62;
      carousel.scrollLeft += (reverse ? -1 : 1) * pixelsPerSecond * (elapsed / 1000);

      if (loopWidth > 0 && !reverse && carousel.scrollLeft >= loopWidth) {
        carousel.scrollLeft -= loopWidth;
      } else if (loopWidth > 0 && reverse && carousel.scrollLeft <= 0) {
        carousel.scrollLeft += loopWidth;
      }

      previousTime = time;
      animationFrame = window.requestAnimationFrame(move);
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      previousTime = 0;

      if (mobile.matches) {
        measure();
        animationFrame = window.requestAnimationFrame(move);
      } else {
        carousel.scrollLeft = 0;
      }
    };

    start();
    mobile.addEventListener('change', start);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      mobile.removeEventListener('change', start);
    };
  }, [images.length, reverse, variant]);

  return (
    <section ref={carouselRef} className={`photo-carousel photo-carousel-${variant} ${reverse ? 'photo-carousel-reverse' : ''}`} aria-label={label}>
      <div className="photo-carousel-track">
        {[false, true].map((duplicate) => (
          <div
            className="photo-carousel-group"
            key={duplicate ? 'duplicate' : 'primary'}
            aria-hidden={duplicate || undefined}
          >
            {images.map(([src, alt]) => (
              <figure className="photo-carousel-card" key={`${src}-${duplicate ? 'duplicate' : 'primary'}`}>
                <img
                  src={src}
                  alt={duplicate ? '' : alt}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FireIntro() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="intro intro-logo-pulse" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <div className="intro-noise" />
          <motion.div
            className="intro-content brand-intro-content"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: [0.92, 1.045, 0.985, 1.025, 1], opacity: [0, 1, 1, 1, 1] }}
            transition={{ duration: 1.45, times: [0, 0.3, 0.55, 0.78, 1], ease: 'easeInOut' }}
          >
            <img src="/brand/skull.webp" alt="Muerto De Hambre Grill skull logo" className="intro-skull" />
            <img src="/brand/phillipians.webp" alt="Philippians 4:13" className="intro-verse" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CateringModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (open) setStatus('idle');
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const form = event.currentTarget;

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CATERING_EMAIL}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div className="order-modal brand-order-modal catering-modal" role="dialog" aria-modal="true" aria-labelledby="catering-title" initial={{ opacity: 0, y: 36, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close catering form"><X size={22} /></button>
            <span className="eyebrow">CATERING REQUEST</span>
            <h2 id="catering-title">TELL US ABOUT YOUR EVENT.</h2>
            <p>Share the basics and the Muerto De Hambre team will follow up with you directly.</p>

            {status === 'success' ? (
              <div className="catering-success" role="status">
                <h3>REQUEST SENT.</h3>
                <p>Thank you. The Muerto De Hambre team will contact you about your event.</p>
                <button type="button" className="order-button catering-submit" onClick={onClose}>Done</button>
              </div>
            ) : (
              <form className="catering-form" action={`https://formsubmit.co/${CATERING_EMAIL}`} method="POST" onSubmit={submitRequest}>
                <input type="hidden" name="_subject" value="New Muerto De Hambre catering request" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value="https://muertodehambre.com/?catering=sent#catering" />
                <label className="catering-honeypot" aria-hidden="true">Leave this empty<input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></label>

                <div className="catering-form-grid">
                  <label className="catering-field">
                    <span>Name</span>
                    <input type="text" name="name" autoComplete="name" required />
                  </label>
                  <label className="catering-field">
                    <span>Phone number</span>
                    <input type="tel" name="phone" autoComplete="tel" inputMode="tel" required />
                  </label>
                  <label className="catering-field catering-field-full">
                    <span>Expected guest amount <small>(estimate)</small></span>
                    <input type="number" name="estimated_guests" min="1" inputMode="numeric" required />
                  </label>
                  <label className="catering-field catering-field-full">
                    <span>Brief message about the event</span>
                    <textarea name="event_message" rows={5} required />
                  </label>
                </div>

                {status === 'error' && <p className="catering-form-error" role="alert">We couldn’t send that request. Please try again or email <a href={`mailto:${CATERING_EMAIL}`}>{CATERING_EMAIL}</a>.</p>}
                <button type="submit" className="order-button catering-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send catering request'}<Send size={17} /></button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [preferred, setPreferred] = useState<LocationKey | null>(null);
  useEffect(() => {
    const saved = window.localStorage.getItem('mdh-preferred-location');
    setPreferred(saved && locations.some((location) => location.key === saved) ? saved as LocationKey : null);
  }, [open]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const choose = (location: RestaurantLocation) => {
    window.localStorage.setItem('mdh-preferred-location', location.key);
    window.location.href = location.orderUrl;
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div className="order-modal brand-order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title" initial={{ opacity: 0, y: 36, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close order location selector"><X size={22} /></button>
            <span className="eyebrow">ORDER ONLINE</span>
            <h2 id="order-title">WHERE ARE YOU HUNGRY?</h2>
            <p>Choose your Muerto De Hambre location and jump straight into that store’s live ordering menu.</p>
            <div className="location-choice-grid">
              {locations.map((location) => (
                <button className="location-choice brand-location-choice" type="button" key={location.key} onClick={() => choose(location)}>
                  <div className="location-choice-topline"><MapPin size={20} />{preferred === location.key && <span className="last-used">Last used</span>}</div>
                  <strong>{location.city}</strong><span>{location.address}</span>
                  <div className="choice-cta">Order {location.city}<ArrowRight size={18} /></div>
                </button>
              ))}
            </div>
            <small>Pickup, delivery, menu availability and checkout continue securely through each location’s ordering partner.</small>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ onOrder }: { onOrder: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useMemo(() => [
    { label: 'Story', href: '#story' }, { label: 'Favorites', href: '#favorites' }, { label: 'Catering', href: '#catering' }, { label: 'Locations', href: '/locations' },
  ], []);
  return (
    <header className="site-header brand-header">
      <a className="brand-header-logo" href="#top" aria-label="Muerto De Hambre Grill home"><img src="/brand/header.webp" alt="Muerto De Hambre Grill" /></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        <a className="instagram-nav-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a>
      </nav>
      <button className="order-button order-button-header" type="button" onClick={onOrder}>Order Online<Flame size={16} fill="currentColor" /></button>
      <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      <AnimatePresence>{menuOpen && (
        <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Instagram</a>
          <button type="button" onClick={() => { setMenuOpen(false); onOrder(); }}>Order Online</button>
        </motion.nav>
      )}</AnimatePresence>
    </header>
  );
}

export default function SiteExperience() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [cateringOpen, setCateringOpen] = useState(false);
  const orderLocation = (location: RestaurantLocation) => {
    window.localStorage.setItem('mdh-preferred-location', location.key);
    window.location.href = location.orderUrl;
  };
  const ticker = ['MUERTO DE HAMBRE', 'SAN BERNARDINO', 'COME HUNGRY', 'LAWNDALE', 'RIVERSIDE FOODLAB', 'ORDER ONLINE', 'MEXICAN + FUSION'];
  return (
    <>
      <FireIntro /><Header onOrder={() => setOrderOpen(true)} /><OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} /><CateringModal open={cateringOpen} onClose={() => setCateringOpen(false)} />
      <main id="top" className="site-backdrop">
        <div className="site-backdrop-art" aria-hidden="true" />
        <section className="hero brand-hero">
          <motion.img src="/brand/outline.webp" alt="" aria-hidden="true" className="hero-outline-art" initial={{ opacity: 0, x: 60, scale: 0.94 }} animate={{ opacity: 0.72, x: 0, scale: 1 }} transition={{ duration: 1, delay: 0.1 }} />
          <div className="hero-shade" /><div className="hero-grain" />
          <motion.div className="hero-content brand-hero-content" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18 }}>
            <span className="eyebrow">SAN BERNARDINO · LAWNDALE · RIVERSIDE</span>
            <h1>COME<span>HUNGRY.</span></h1>
            <p>Authentic Mexican flavor meets Gio’s fusion creativity. Three Southern California locations, one unmistakable Muerto De Hambre attitude.</p>
            <div className="hero-actions"><button type="button" className="order-button hero-order" onClick={() => setOrderOpen(true)}>Order Online<ArrowRight size={19} /></button><a className="ghost-button brand-ghost" href="/locations">View Locations</a></div>
            <a className="instagram-hero-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={16} /> Follow @muertodehambregrill</a>
          </motion.div>
          <a className="scroll-cue" href="#favorites" aria-label="Scroll to featured section">Scroll<ChevronDown size={18} /></a>
        </section>

        <section className="ticker brand-ticker" aria-label="Restaurant highlights"><div className="ticker-track">{ticker.concat(ticker).map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div></section>

        <section className="section favorites brand-favorites" id="favorites">
          <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.62 }}>
            <span className="eyebrow">THE FIRST BITE</span><h2>LOUD FLAVOR.<br />NO APOLOGIES.</h2>
          </motion.div>
          <div className="food-grid">
            {[['food-card-large food-one','01','Signature Plates','Hero-worthy plates belong here.'],['food-two','02','Grill Favorites','Char, crunch, sauce, repeat.'],['food-three','03','Hambre Favorites','The dishes regulars come back for.']].map(([extra, num, title, copy], index) => (
              <motion.article key={num} className={`food-card ${extra}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.07 }}><div className="food-card-overlay" /><div className="food-copy"><span>{num}</span><h3>{title}</h3><p>{copy}</p></div></motion.article>
            ))}
          </div>
          <PhotoCarousel images={foodPhotos} label="More Muerto De Hambre food" variant="food" reverse />
        </section>

        <PhotoCarousel images={eventPhotos} label="Muerto De Hambre community and events" />

        <StorySection />

        <section className="section order-callout brand-order-callout"><motion.div className="order-callout-inner" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.62 }}><img src="/brand/mascot.webp" alt="" aria-hidden="true" className="callout-mascot" /><span className="eyebrow">SKIP THE SCROLL</span><h2>HUNGRY ALREADY?</h2><p>Choose San Bernardino, Lawndale, or Riverside and jump straight into the live ordering menu.</p><button type="button" className="order-button callout-button" onClick={() => setOrderOpen(true)}>Choose a location<ArrowRight size={19} /></button></motion.div></section>

        <section className="catering brand-catering" id="catering"><div className="catering-photo" /><div className="catering-shade" /><motion.div className="catering-content" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}><span className="eyebrow">FEED THE WHOLE CREW</span><h2>CATERING,<br />MUERTO STYLE.</h2><p>Planning a party, celebration, or company event? Tell us the basics and the Muerto De Hambre team will follow up.</p><button className="ghost-button light catering-form-trigger" type="button" onClick={() => setCateringOpen(true)}>Fill out form</button></motion.div></section>

        <section className="section locations-section brand-locations-preview" id="locations">
          <motion.div className="section-heading centered" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}><span className="eyebrow">THREE SPOTS. SAME HUNGER.</span><img className="locations-heading-logo" src="/brand/mdh.webp" alt="Muerto De Hambre — The Flavor" /><p>See each location right on the map, plus full weekly hours, directions, online ordering, and delivery options.</p></motion.div>
          <div className="location-grid">{locations.map((location, index) => (
            <motion.article className="location-card brand-location-card" key={location.key} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.58, delay: index * 0.08 }}>
              <div className="location-card-map">
                <iframe title={`${location.city} Google Map`} src={mapEmbedUrl(location.mapQuery)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <div className="location-card-body"><MapPin size={18} /><span>CALIFORNIA</span><h3>{location.city}</h3><p>{location.address}</p><div className="location-delivery-options"><strong>Delivery options</strong><div>{location.deliveryPartners.map((partner) => <a href={partner.url} target="_blank" rel="noreferrer" key={partner.name}>{partner.name}</a>)}</div></div><div className="location-card-actions"><button type="button" onClick={() => orderLocation(location)}>Order online <ArrowRight size={18} /></button><a href="/locations">Hours & directions</a></div></div>
            </motion.article>
          ))}</div>
        </section>
      </main>

      <footer className="footer brand-footer"><div className="footer-mark"><UtensilsCrossed size={26} /><strong>MUERTO DE HAMBRE</strong><span>GRILL</span></div><div className="footer-links"><a href="#favorites">Food</a><a href="#story">Story</a><a href="/locations">Locations</a><a className="instagram-footer-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a><button type="button" onClick={() => setOrderOpen(true)}>Order Online</button></div><p>San Bernardino · Lawndale · Riverside · California</p></footer>
      <button className="mobile-order-sticky" type="button" onClick={() => setOrderOpen(true)}><Flame size={17} fill="currentColor" />Order Online</button>
    </>
  );
}
