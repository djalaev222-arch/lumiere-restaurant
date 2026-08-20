import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../ui/RevealOnScroll';
import Button from '../ui/Button';
import './cta-banner.css';

export default function CtaBanner() {
  const { t } = useTranslation();

  return (
    <section className="cta-banner">
      <div className="container">
        <RevealOnScroll className="cta-banner__inner">
          <h2>{t('home.ctaTitle')}</h2>
          <p>{t('home.ctaSubtitle')}</p>
          <Button to="/booking" variant="primary" size="lg">
            {t('common.bookTable')}
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
