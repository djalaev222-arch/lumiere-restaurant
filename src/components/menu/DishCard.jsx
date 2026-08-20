import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCheck, FiStar } from 'react-icons/fi';
import { formatPrice, localized } from '../../lib/format';
import { useCartStore } from '../../store/cartStore';
import RevealOnScroll from '../ui/RevealOnScroll';
import './dish-card.css';

const TAG_LABELS = {
  vegetarian: '🌱',
  spicy: '🌶',
};

export default function DishCard({ dish, index = 0 }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(dish.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <RevealOnScroll className="dish-card" delay={Math.min(index * 0.05, 0.3)}>
      <div className="dish-card__media">
        <img
          src={dish.image}
          alt={localized(dish.name, lang)}
          loading="lazy"
          width={800}
          height={600}
        />
        {dish.tags.includes('chefChoice') && (
          <span className="dish-card__badge">
            <FiStar size={12} /> {t('menu.filters.chefChoice')}
          </span>
        )}
      </div>

      <div className="dish-card__body">
        <div className="dish-card__heading">
          <h3>{localized(dish.name, lang)}</h3>
          <span className="dish-card__price">
            {formatPrice(dish.price, lang)} {t('common.currency')}
          </span>
        </div>

        <p className="dish-card__desc">{localized(dish.description, lang)}</p>

        <div className="dish-card__meta">
          <span>
            {dish.weight} {t('menu.weightLabel')}
          </span>
          {dish.tags
            .filter((tag) => TAG_LABELS[tag])
            .map((tag) => (
              <span key={tag} aria-hidden="true">
                {TAG_LABELS[tag]}
              </span>
            ))}
        </div>

        <button type="button" className="dish-card__add" onClick={handleAdd}>
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="added"
                className="dish-card__add-label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <FiCheck size={16} /> {t('common.added')}
              </motion.span>
            ) : (
              <motion.span
                key="add"
                className="dish-card__add-label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <FiPlus size={16} /> {t('common.addToCart')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </RevealOnScroll>
  );
}
