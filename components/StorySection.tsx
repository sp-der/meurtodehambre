'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useRef } from 'react';
import styles from './StorySection.module.css';

const chapters = [
  {
    number: '01',
    title: 'The Rat Race',
    body:
      'Before Muerto De Hambre, Gio Bravo spent roughly four to five years working in transportation, port imports and port exports. He eventually worked in management, but the job had begun to feel like a rat race that kept him stuck.',
  },
  {
    number: '02',
    title: 'The Turning Point',
    body:
      'When his management position was eliminated during company layoffs, Gio found himself asking what came next. He did not see the moment only as a setback. In his own words, some blessings come in disguise, and losing that job became the start of a new chapter.',
  },
  {
    number: '03',
    title: 'The Decision',
    body:
      'Music and food had always been major passions. After taking time to think, Gio chose to pursue food vending with his sights set on the food-truck life. He was ready for the hard work and long hours if they were going toward something he could build for himself and his family.',
  },
  {
    number: '04',
    title: 'Muerto De Hambre',
    body:
      'The project got its name: Muerto De Hambre Grill. From the beginning, Gio described the idea as authentic Mexican cuisine with fusion foods, built around his own creativity and the decision to bet on something of his own.',
  },
];

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 38%'],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  return (
    <section ref={sectionRef} className={styles.story} id="story">
      <div className={styles.glow} aria-hidden="true" />

      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65 }}
      >
        <span className={styles.eyebrow}>OUR STORY</span>
        <h2>
          BUILT FROM A
          <span>NEW BEGINNING.</span>
        </h2>
      </motion.header>

      <div className={styles.timelineWrap}>
        <div className={styles.rail} aria-hidden="true">
          <motion.div className={styles.railFire} style={{ scaleY: lineProgress }} />
        </div>

        <div className={styles.timeline}>
          {chapters.map((chapter, index) => (
            <motion.article
              className={styles.chapter}
              key={chapter.number}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, delay: index * 0.05 }}
            >
              <div className={styles.node} aria-hidden="true">
                <Flame size={16} fill="currentColor" />
              </div>
              <span className={styles.number}>{chapter.number}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <motion.blockquote
        className={styles.quote}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.62 }}
      >
        <Flame size={27} strokeWidth={1.5} />
        <p>“I kind of want to build something that is for me. For my family.”</p>
        <footer>Gio Bravo</footer>
      </motion.blockquote>

      <motion.div
        className={styles.today}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.58 }}
      >
        <span>THE STORY TODAY</span>
        <p>
          What started as a food-vendor dream now carries the Muerto De Hambre name in San Bernardino, Lawndale, and Riverside. The original idea is still at the center of it: build something of your own, feed people well, and keep moving forward.
        </p>
      </motion.div>
    </section>
  );
}
