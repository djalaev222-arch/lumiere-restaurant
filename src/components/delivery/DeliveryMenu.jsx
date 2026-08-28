import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { formatPrice, localized } from '../../lib/format';
import { useCartStore } from '../../store/cartStore';
import './delivery-menu.css';

function DishRow({ dish }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const setQty = useCartStore((state) => state.setQty);

  const qty = items.find((item) => item.id === dish.id)?.qty ?? 0;
  const name = localized(dish.name, lang);

  return (
    <li className="delivery-dish">
      <img src={dish.image} alt={name} loading="lazy" width={96} height={96} />
      <div className="delivery-dish__info">
        <h4>{name}</h4>
        <p>{localized(dish.description, lang)}</p>
        <span className="delivery-dish__price">
          {formatPrice(dish.price, lang)} {t('common.currency')}
          <i>· {dish.weight} {t('menu.weightLabel')}</i>
        </span>
      </div>

      {qty === 0 ? (
        <button
          type="button"
          className="delivery-dish__add"
          onClick={() => addItem(dish.id, 1)}
          aria-label={`${t('common.addToCart')} — ${name}`}
        >
          <FiPlus size={16} />
        </button>
      ) : (
        <div className="delivery-dish__stepper" aria-label={t('delivery.qty')}>
          <button type="button" onClick={() => setQty(dish.id, qty - 1)} aria-label="-">
            <FiMinus size={14} />
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(dish.id, qty + 1)} aria-label="+">
            <FiPlus size={14} />
          </button>
        </div>
      )}
    </li>
  );
}

export default function DeliveryMenu({ categories, dishes }) {
  const { t } = useTranslation();
  const [active, setActive] = useState('all');

  const categoryIds = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => c.id),
    [categories]
  );

  const groups = useMemo(
    () =>
      categoryIds
        .filter((cat) => active === 'all' || cat === active)
        .map((cat) => ({ cat, items: dishes.filter((dish) => dish.category === cat) }))
        .filter((group) => group.items.length > 0),
    [categoryIds, dishes, active]
  );

  return (
    <div className="delivery-menu">
      <div className="delivery-menu__tabs" role="tablist" aria-label={t('nav.menu')}>
        <button
          type="button"
          className={`delivery-menu__tab ${active === 'all' ? 'is-active' : ''}`}
          onClick={() => setActive('all')}
          role="tab"
          aria-selected={active === 'all'}
        >
          {t('menu.filters.all')}
        </button>
        {categoryIds.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`delivery-menu__tab ${active === cat ? 'is-active' : ''}`}
            onClick={() => setActive(cat)}
            role="tab"
            aria-selected={active === cat}
          >
            {t(`menu.categories.${cat}`)}
          </button>
        ))}
      </div>

      {groups.map((group) => (
        <section className="delivery-menu__group" key={group.cat}>
          <h3 className="delivery-menu__group-title">{t(`menu.categories.${group.cat}`)}</h3>
          <ul className="delivery-menu__list">
            {group.items.map((dish) => (
              <DishRow key={dish.id} dish={dish} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
