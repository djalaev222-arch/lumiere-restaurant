import { useTranslation } from 'react-i18next';
import { FiCheck, FiCreditCard, FiGift } from 'react-icons/fi';
import RevealOnScroll from '../ui/RevealOnScroll';
import Button from '../ui/Button';
import './loyalty.css';

export default function Loyalty() {
  const { t } = useTranslation();
  const points = [t('home.loyaltyPoint1'), t('home.loyaltyPoint2'), t('home.loyaltyPoint3')];

  return (
    <section className="section section--tight loyalty" id="loyalty" aria-labelledby="loyalty-heading">
      <div className="container">
        <RevealOnScroll className="loyalty__inner">
          <div className="loyalty__main">
            <span className="eyebrow">{t('home.loyaltyEyebrow')}</span>
            <h2 id="loyalty-heading">
              <FiCreditCard size={26} aria-hidden="true" /> {t('home.loyaltyTitle')}
            </h2>
            <p className="loyalty__lead">{t('home.loyaltyText')}</p>
            <ul className="loyalty__points">
              {points.map((point) => (
                <li key={point}>
                  <FiCheck size={16} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <Button href="#booking" variant="primary">
              {t('home.loyaltyCta')}
            </Button>
          </div>

          <aside className="loyalty__offer">
            <span className="loyalty__offer-badge">
              <FiGift size={14} aria-hidden="true" /> {t('home.loyaltyOfferBadge')}
            </span>
            <p>{t('home.loyaltyOfferText')}</p>
          </aside>
        </RevealOnScroll>
      </div>
    </section>
  );
}
