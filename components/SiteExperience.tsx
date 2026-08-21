'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera as Instagram, ChevronDown, Flame, MapPin, Menu, UtensilsCrossed, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import StorySection from './StorySection';
import { locations, type LocationKey, type RestaurantLocation } from '../lib/locations';

const INSTAGRAM_URL = 'https://www.instagram.com/muertodehambregrill/';
const reveal = { hidden: { opacity: 0, y: 42 }, visible: { opacity: 1, y: 0 } };
const mapEmbedUrl = (address: string) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

function playFireWhoosh() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const duration = 1.35;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) channel[i] = (Math.random() * 2 - 1) * (1 - i / channel.length);
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
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + duration);
  } catch {}
}

function FireIntro() {
  const [visible, setVisible] = useState(true);
  const [burning, setBurning] = useState(false);
  useEffect(() => { if (window.sessionStorage.getItem('mdh-intro-seen') === '1') setVisible(false); }, []);
  const finishIntro = () => {
    window.sessionStorage.setItem('mdh-intro-seen', '1');
    setBurning(true);
    playFireWhoosh();
    window.setTimeout(() => setVisible(false), 1650);
  };
  const skipIntro = () => { window.sessionStorage.setItem('mdh-intro-seen', '1'); setVisible(false); };
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className={`intro ${burning ? 'intro-burning' : ''}`} initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="intro-noise" />
          <div className="intro-embers" aria-hidden="true">{Array.from({ length: 24 }).map((_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}</div>
          <div className="fire-sweep" aria-hidden="true"><span className="flame flame-one" /><span className="flame flame-two" /><span className="flame flame-three" /><span className="flame flame-four" /></div>
          <motion.div className="intro-content brand-intro-content" animate={burning ? { scale: 1.04, opacity: 0.15 } : { scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
            <img src="/brand/header.webp" alt="Muerto De Hambre Grill" className="intro-logo" />
            <p>Tap to ignite the grill.</p>
            <button type="button" className="ignite-button" onClick={finishIntro} disabled={burning}><Flame size={18} fill="currentColor" />Enter Hungry</button>
            <button type="button" className="skip-intro" onClick={skipIntro} disabled={burning}>Skip intro</button>
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
            <small>Pickup, delivery, menu availability and checkout continue securely through Otter.</small>
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
  const orderLocation = (location: RestaurantLocation) => {
    window.localStorage.setItem('mdh-preferred-location', location.key);
    window.location.href = location.orderUrl;
  };
  const ticker = ['MUERTO DE HAMBRE', 'SAN BERNARDINO', 'COME HUNGRY', 'LAWNDALE', 'ORDER ONLINE', 'MEXICAN + FUSION'];
  return (
    <>
      <FireIntro /><Header onOrder={() => setOrderOpen(true)} /><OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
      <main id="top">
        <section className="hero brand-hero">
          <div className="brand-pattern" aria-hidden="true" /><div className="hero-gold-orbit orbit-one" aria-hidden="true" /><div className="hero-gold-orbit orbit-two" aria-hidden="true" /><div className="hero-shade" /><div className="hero-grain" />
          <motion.img src="/brand/mascot.webp" alt="" aria-hidden="true" className="hero-mascot" initial={{ opacity: 0, x: 60, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1, delay: 0.1 }} />
          <motion.div className="hero-content brand-hero-content" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18 }}>
            <span className="eyebrow">SAN BERNARDINO · LAWNDALE</span>
            <img src="/brand/header.webp" alt="Muerto De Hambre Grill" className="hero-logo" />
            <h1>COME<span>HUNGRY.</span></h1>
            <p>Authentic Mexican flavor meets Gio’s fusion creativity. Two Southern California locations, one unmistakable Muerto De Hambre attitude.</p>
            <div className="hero-actions"><button type="button" className="order-button hero-order" onClick={() => setOrderOpen(true)}>Order Online<ArrowRight size={19} /></button><a className="ghost-button brand-ghost" href="/locations">View Locations</a></div>
            <a className="instagram-hero-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={16} /> Follow @muertodehambregrill</a>
          </motion.div>
          <a className="scroll-cue" href="#favorites" aria-label="Scroll to featured section">Scroll<ChevronDown size={18} /></a>
        </section>

        <section className="ticker brand-ticker" aria-label="Restaurant highlights"><div className="ticker-track">{ticker.concat(ticker).map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div></section>

        <section className="section favorites brand-favorites" id="favorites">
          <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.62 }}>
            <span className="eyebrow">THE FIRST BITE</span><h2>LOUD FLAVOR.<br />NO APOLOGIES.</h2><p>These photo slots are ready for Hambre’s real signature dishes. The new framing follows the same bold poster language used across the Instagram feed.</p>
          </motion.div>
          <div className="food-grid">
            {[['food-card-large food-one','01','Signature Plates','Hero-worthy plates belong here.'],['food-two','02','Grill Favorites','Char, crunch, sauce, repeat.'],['food-three','03','Hambre Favorites','The dishes regulars come back for.']].map(([extra, num, title, copy], index) => (
              <motion.article key={num} className={`food-card ${extra}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.07 }}><div className="food-card-overlay" /><div className="food-copy"><span>{num}</span><h3>{title}</h3><p>{copy}</p></div></motion.article>
            ))}
          </div>
        </section>

        <StorySection />

        <section className="section order-callout brand-order-callout"><motion.div className="order-callout-inner" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.62 }}><img src="/brand/mascot.webp" alt="" aria-hidden="true" className="callout-mascot" /><span className="eyebrow">SKIP THE SCROLL</span><h2>HUNGRY ALREADY?</h2><p>Choose San Bernardino or Lawndale and jump straight into the live ordering menu.</p><button type="button" className="order-button callout-button" onClick={() => setOrderOpen(true)}>Choose a location<ArrowRight size={19} /></button></motion.div></section>

        <section className="catering brand-catering" id="catering"><div className="catering-photo" /><div className="catering-shade" /><motion.div className="catering-content" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}><span className="eyebrow">FEED THE WHOLE CREW</span><h2>CATERING,<br />MUERTO STYLE.</h2><p>We’ll lock this section to Hambre’s real catering packages and inquiry process as soon as those details are confirmed.</p><a className="ghost-button light" href="/locations">Find a location</a></motion.div></section>

        <section className="section locations-section brand-locations-preview" id="locations">
          <motion.div className="section-heading centered" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}><span className="eyebrow">TWO SPOTS. SAME HUNGER.</span><h2>FIND YOUR HAMBRE.</h2><p>See each location right on the map, plus full weekly hours, directions, and online ordering.</p></motion.div>
          <div className="location-grid">{locations.map((location, index) => (
            <motion.article className="location-card brand-location-card" key={location.key} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.58, delay: index * 0.08 }}>
              <div className="location-card-map">
                <iframe title={`${location.city} Google Map`} src={mapEmbedUrl(location.address)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <div className="location-card-body"><MapPin size={18} /><span>CALIFORNIA</span><h3>{location.city}</h3><p>{location.address}</p><div className="location-card-actions"><button type="button" onClick={() => orderLocation(location)}>Order this location <ArrowRight size={18} /></button><a href="/locations">Hours & directions</a></div></div>
            </motion.article>
          ))}</div>
        </section>
      </main>

      <footer className="footer brand-footer"><div className="footer-mark"><UtensilsCrossed size={26} /><strong>MUERTO DE HAMBRE</strong><span>GRILL</span></div><div className="footer-links"><a href="#favorites">Food</a><a href="#story">Story</a><a href="/locations">Locations</a><a className="instagram-footer-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a><button type="button" onClick={() => setOrderOpen(true)}>Order Online</button></div><p>San Bernardino · Lawndale · California</p></footer>
      <button className="mobile-order-sticky" type="button" onClick={() => setOrderOpen(true)}><Flame size={17} fill="currentColor" />Order Online</button>
    </>
  );
}
