import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './hero.css';

const INTERIOR_IMG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=60';
const DISH_IMG =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=74';

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
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src={INTERIOR_IMG} alt="" loading="eager" fetchPriority="high" width={1600} height={1067} />
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
            <Button to="/booking" size="lg">
              {t('common.bookTable')}
            </Button>
            <Button to="/delivery" variant="outline" size="lg">
              {t('common.orderDelivery')}
            </Button>
          </motion.div>

          <motion.ul className="hero__meta" variants={item}>
            <li>{t('home.heroMetaHours')}</li>
            <li>{t('home.heroMetaAddress')}</li>
            <li>{t('home.heroMetaDelivery')}</li>
          </motion.ul>
        </motion.div>

        <motion.figure
          className="hero__figure"
          initial={{ opacity: 0, y: reduced ? 0 : 34, scale: reduced ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={DISH_IMG}
            alt={t('home.menuPreviewTitle')}
            loading="eager"
            width={1000}
            height={1250}
          />
          <figcaption>{t('home.heroFigureCaption')}</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
