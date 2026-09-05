import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { photo } from '../../lib/assets';
import './hero.css';

const INTERIOR_IMG = photo('1517248135467-4c7edcad34c4', 1600);
const DISH_IMG = photo('1414235077428-338989a2e8c0', 1000, 1250);

export default function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: reduced ? 0 : 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <img
          className={reduced ? '' : 'hero__bg-kenburns'}
          src={INTERIOR_IMG}
          alt=""
          loading="eager"
          fetchPriority="high"
          width={1600}
          height={1067}
        />
        <div className="hero__scrim" />
        <div className="hero__glow" />
      </div>

      <div className="container hero__inner">
        <motion.div className="hero__content" variants={container} initial="hidden" animate="show">
          <motion.span className="eyebrow" variants={item}>
            {t('home.heroEyebrow')}
          </motion.span>

          <h1 className="hero__title">
            <motion.span className="hero__title-line" variants={item}>
              {t('home.heroTitleLead')}
            </motion.span>
            <motion.span className="hero__title-line" variants={item}>
              <em>{t('home.heroTitleAccent')}</em> {t('home.heroTitleTail')}
            </motion.span>
          </h1>

          <motion.p className="hero__subtitle" variants={item}>
            {t('home.heroSubtitle')}
          </motion.p>

          <motion.div className="hero__actions" variants={item}>
            <Button href="#booking" size="lg">
              {t('common.bookTable')}
            </Button>
            <Button href="#menu" variant="outline" size="lg">
              {t('common.viewMenu')}
            </Button>
          </motion.div>

          <motion.ul className="hero__meta" variants={item}>
            <li>{t('home.heroMetaHours')}</li>
            <li>{t('home.heroMetaAddress')}</li>
            <li>{t('home.heroMetaDelivery')}</li>
          </motion.ul>
        </motion.div>
      </div>

      <motion.div
        className="hero__figure"
        aria-hidden="true"
        initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={DISH_IMG} alt="" loading="eager" width={1400} height={1750} />
      </motion.div>

      <a className="hero__scroll" href="#scenarios" aria-label={t('home.heroScroll')}>
        <span>{t('home.heroScroll')}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
