import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import DishCard from '../menu/DishCard';
import { useMenu } from '../../hooks/useMenu';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './menu-section.css';

const PER_CATEGORY = 6;

export default function MenuSection() {
  const { t } = useTranslation();
  const { categories, dishes, status } = useMenu();
  const reduced = useReducedMotion();

  const categoryIds = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((category) => category.id),
    [categories]
  );

  const [active, setActive] = useState(null);
  const current = active ?? categoryIds[0];

  const shown = useMemo(
    () => dishes.filter((dish) => dish.category === current).slice(0, PER_CATEGORY),
    [dishes, current]
  );

  return (
    <section className="section menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.menuEyebrow')}
          title={t('home.menuTitle')}
          titleId="menu-heading"
          subtitle={t('home.menuSubtitle')}
        />

        {status === 'error' && <p className="menu-section__empty">{t('common.loadError')}</p>}
        {(status === 'idle' || status === 'loading') && (
          <p className="menu-section__empty">{t('common.loading')}</p>
        )}

        {status === 'success' && categoryIds.length > 0 && (
          <>
            <div className="menu-section__tabs" role="tablist" aria-label={t('home.menuEyebrow')}>
              {categoryIds.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={current === category}
                  className={`menu-section__tab ${current === category ? 'is-active' : ''}`}
                  onClick={() => setActive(category)}
                >
                  {t(`menu.categories.${category}`)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="menu-section__grid"
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {shown.map((dish, index) => (
                  <DishCard key={dish.id} dish={dish} index={index} compact />
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="section__foot">
              <Button to="/menu" variant="outline" icon={<FiArrowRight size={16} />}>
                {t('home.menuFullCta')}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
