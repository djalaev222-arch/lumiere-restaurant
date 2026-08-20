import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import BookingForm from '../components/booking/BookingForm';
import './booking.css';

export default function Booking() {
  const { t } = useTranslation();

  return (
    <>
      <SeoHead title={t('booking.title')} description={t('booking.subtitle')} path="/booking" />

      <section className="booking-page">
        <div className="container booking-page__grid">
          <RevealOnScroll className="booking-page__intro">
            <span className="eyebrow">{t('nav.booking')}</span>
            <h1>{t('booking.title')}</h1>
            <p>{t('booking.subtitle')}</p>

            <div className="booking-page__info">
              <h3>{t('booking.infoTitle')}</h3>
              <p>{t('booking.infoText')}</p>
              <a href="tel:+74950001234" className="booking-page__phone">
                {t('common.phone')}
              </a>
              <span>{t('common.openHours')}</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <BookingForm />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
