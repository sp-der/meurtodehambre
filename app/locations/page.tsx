import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { locations } from '../../lib/locations';
import styles from './locations.module.css';

export const metadata = {
  title: 'Locations | Muerto De Hambre Grill',
  description: 'Hours, addresses, maps, online ordering, and delivery options for Muerto De Hambre Grill in San Bernardino, Lawndale, and Riverside.',
};

const mapEmbedUrl = (query: string) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

export default function LocationsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pattern} aria-hidden="true" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={17} /> Home
        </Link>
        <img src="/brand/header.webp" alt="Muerto De Hambre Grill" className={styles.logo} />
        <span className={styles.kicker}>COME HUNGRY.</span>
      </header>

      <section className={styles.hero}>
        <span>THREE SPOTS. SAME HUNGER.</span>
        <h1>LOCATIONS</h1>
        <p>See each location on Google Maps, check current hours, order online, or choose an available delivery partner.</p>
      </section>

      <section className={styles.grid}>
        {locations.map((location) => (
          <article className={styles.card} key={location.key}>
            <div className={styles.cardHead}>
              <div>
                <span className={styles.pin}><MapPin size={17} /> California</span>
                <h2>{location.city}</h2>
                <p>{location.address}</p>
              </div>
              {location.badge && <strong className={styles.badge}>{location.badge}</strong>}
            </div>

            <div className="location-map-embed">
              <iframe
                title={`${location.city} Google Map`}
                src={mapEmbedUrl(location.mapQuery)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className={styles.hours}>
              <div className={styles.hoursTitle}><Clock3 size={17} /> Weekly schedule</div>
              {location.hours.map((row) => (
                <div className={styles.hourRow} key={row.days}>
                  <span>{row.days}</span>
                  <div>
                    <strong>{row.hours}</strong>
                    {row.note && <small>{row.note}</small>}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.delivery}>
              <span>Delivery options</span>
              <div>
                {location.deliveryPartners.map((partner) => (
                  <a href={partner.url} target="_blank" rel="noreferrer" key={partner.name}>
                    {partner.name} <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <a href={location.orderUrl} target="_blank" rel="noreferrer" className={styles.order}>
                Order online <ArrowUpRight size={18} />
              </a>
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.directions}
              >
                Directions <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.notice}>
        <img src="/brand/mascot.webp" alt="" aria-hidden="true" />
        <div>
          <span>SCHEDULE / SOLD OUT UPDATES</span>
          <h2>KEEP AN EYE ON OUR STORIES.</h2>
          <p>Hours can shift and popular items can sell out. Instagram is the fastest place to catch same-day updates.</p>
          <a href="https://www.instagram.com/muertodehambregrill/" target="_blank" rel="noreferrer">
            @muertodehambregrill <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
