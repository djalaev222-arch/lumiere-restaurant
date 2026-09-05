import { useTranslation } from 'react-i18next';
import { FiPhone } from 'react-icons/fi';
import RevealOnScroll from '../ui/RevealOnScroll';
import BookingForm from '../booking/BookingForm';
import './booking-section.css';

const PHONE = '+74950001234';

export default function BookingSection() {
  const { t } = useTranslation();

  return (
    <section className="section booking-section" id="booking" aria-labelledby="booking-heading">
      <div className="container booking-section__grid">
        <RevealOnScroll className="booking-section__intro">
          <span className="eyebrow">{t('home.bookingEyebrow')}</span>
          <h2 id="booking-heading">{t('home.bookingTitle')}</h2>
          <p>{t('home.bookingText')}</p>

          <div className="booking-section__info">
            <h3>{t('home.bookingInfoTitle')}</h3>
            <p>{t('home.bookingInfoText')}</p>
            <a href={`tel:${PHONE}`} className="booking-section__phone">
              <FiPhone size={16} aria-hidden="true" /> {t('common.phone')}
            </a>
            <span>{t('common.openHours')}</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <BookingForm />
        </RevealOnScroll>
      </div>
    </section>
  );
}
