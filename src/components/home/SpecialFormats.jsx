import { useTranslation } from 'react-i18next';
import { FiArrowUpRight, FiPhone } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import RevealOnScroll from '../ui/RevealOnScroll';
import { specialFormats } from '../../data/landing';
import { localized } from '../../lib/format';
import './special-formats.css';

const PHONE = '+74950001234';

export default function SpecialFormats() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  return (
    <section className="section special-formats" id="formats" aria-labelledby="formats-heading">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.formatsEyebrow')}
          title={t('home.formatsTitle')}
          titleId="formats-heading"
        />

        <div className="special-formats__list">
          {specialFormats.map((format, index) => (
            <RevealOnScroll
              key={format.id}
              delay={Math.min(index * 0.08, 0.24)}
              className="format-card"
            >
              <div className="format-card__media">
                <img
                  src={format.image}
                  alt={localized(format.title, lang)}
                  loading="lazy"
                  width={1400}
                  height={1000}
                />
              </div>
              <div className="format-card__body">
                <span className="format-card__meta">{localized(format.meta, lang)}</span>
                <h3>{localized(format.title, lang)}</h3>
                <p>{localized(format.text, lang)}</p>
                <div className="format-card__actions">
                  <a className="format-card__cta" href="#booking">
                    {t('home.formatsCta')} <FiArrowUpRight size={16} />
                  </a>
                  <a className="format-card__call" href={`tel:${PHONE}`} aria-label={t('common.callUs')}>
                    <FiPhone size={15} /> {t('common.phone')}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
