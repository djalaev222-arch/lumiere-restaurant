import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './mobile-booking-bar.css';

const TELEGRAM_URL = 'https://t.me/lumiere_moscow';
const WHATSAPP_URL = 'https://wa.me/74950001234';

// Sticky bottom action bar for the landing on small screens. Hides while the
// booking section is on screen so it doesn't sit on top of the form.
export default function MobileBookingBar() {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById('booking');
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`mobile-book-bar ${hidden ? 'is-hidden' : ''}`}>
      <a
        className="mobile-book-bar__icon"
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('common.telegram')}
      >
        <FiSend size={18} />
      </a>
      <a
        className="mobile-book-bar__icon"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('common.whatsapp')}
      >
        <FaWhatsapp size={18} />
      </a>
      <a className="mobile-book-bar__cta" href="#booking">
        {t('common.bookTable')}
      </a>
    </div>
  );
}
