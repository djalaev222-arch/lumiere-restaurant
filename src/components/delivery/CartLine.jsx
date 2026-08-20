import { useTranslation } from 'react-i18next';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { formatPrice, localized } from '../../lib/format';
import { useCartStore } from '../../store/cartStore';
import './cart-line.css';

export default function CartLine({ dish, qty }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const setQty = useCartStore((state) => state.setQty);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="cart-line">
      <img src={dish.image} alt={localized(dish.name, lang)} width={80} height={80} loading="lazy" />

      <div className="cart-line__info">
        <h4>{localized(dish.name, lang)}</h4>
        <span className="cart-line__unit-price">
          {formatPrice(dish.price, lang)} {t('common.currency')}
        </span>
      </div>

      <div className="cart-line__qty" aria-label={t('delivery.qty')}>
        <button type="button" onClick={() => setQty(dish.id, qty - 1)} aria-label="-">
          <FiMinus size={14} />
        </button>
        <span>{qty}</span>
        <button type="button" onClick={() => setQty(dish.id, qty + 1)} aria-label="+">
          <FiPlus size={14} />
        </button>
      </div>

      <span className="cart-line__total">
        {formatPrice(dish.price * qty, lang)} {t('common.currency')}
      </span>

      <button
        type="button"
        className="cart-line__remove"
        onClick={() => removeItem(dish.id)}
        aria-label={t('delivery.remove')}
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
}
