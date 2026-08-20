import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './hero.css';

export default function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const heroLines = t('home.heroTitle').split('\n');

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="hero">
      <div className="hero__media" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80&auto=format&fit=crop"
          alt=""
          loading="eager"
          fetchPriority="high"
          width={1800}
          height={1200}
        />
        <div className="hero__scrim" />
      </div>

      <motion.div className="container hero__content" variants={container} initial="hidden" animate="show">
        <motion.span className="eyebrow hero__eyebrow" variants={item}>
          {t('home.heroEyebrow')}
        </motion.span>

        <h1 className="hero__title">
          {heroLines.map((line, index) => (
            <motion.span key={line} className="hero__title-line" variants={item}>
              {line}
              {index < heroLines.length - 1 && <br />}
            </motion.span>
          ))}
        </h1>

        <motion.p className="hero__subtitle" variants={item}>
          {t('home.heroSubtitle')}
        </motion.p>

        <motion.div className="hero__actions" variants={item}>
          <Button to="/booking" size="lg">
            {t('common.bookTable')}
          </Button>
          <Button to="/menu" variant="outline" size="lg">
            {t('common.viewMenu')}
          </Button>
        </motion.div>
      </motion.div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
