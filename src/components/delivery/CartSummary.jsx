import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/format';
import { useSettings } from '../../hooks/useSettings';

const FALLBACK_FREE_DELIVERY_THRESHOLD = 3000;
const FALLBACK_DELIVERY_FEE = 250;

export default function CartSummary({ subtotal, deliveryMethod = 'delivery' }) {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  const freeThreshold = settings?.freeDeliveryThreshold ?? FALLBACK_FREE_DELIVERY_THRESHOLD;
  const deliveryFee = settings?.deliveryFee ?? FALLBACK_DELIVERY_FEE;

  const fee = deliveryMethod === 'pickup' || subtotal >= freeThreshold ? 0 : deliveryFee;
  const total = subtotal + fee;

  return (
    <div className="cart-summary">
      <div className="cart-summary__row">
        <span>{t('delivery.subtotal')}</span>
        <span>
          {formatPrice(subtotal, lang)} {t('common.currency')}
        </span>
      </div>
      <div className="cart-summary__row">
        <span>{t('delivery.deliveryFee')}</span>
        <span>{fee === 0 ? t('delivery.deliveryFeeFree') : `${formatPrice(fee, lang)} ${t('common.currency')}`}</span>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <span>{t('delivery.total')}</span>
        <span>
          {formatPrice(total, lang)} {t('common.currency')}
        </span>
      </div>
      {deliveryMethod !== 'pickup' && subtotal < freeThreshold && (
        <p className="cart-summary__hint">
          {t('delivery.freeDeliveryHint', { threshold: formatPrice(freeThreshold, lang) })}
        </p>
      )}
    </div>
  );
}
