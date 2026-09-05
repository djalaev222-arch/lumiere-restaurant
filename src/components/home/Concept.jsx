import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../ui/RevealOnScroll';
import { conceptImage, conceptParallax, conceptStats } from '../../data/landing';
import { localized } from '../../lib/format';
import { useCountUp } from '../../hooks/useCountUp';
import './concept.css';

function Stat({ value, suffix, label }) {
  const [ref, current] = useCountUp(value);
  return (
    <div className="concept-stat" ref={ref}>
      <span className="concept-stat__value">
        {current}
        {suffix}
      </span>
      <span className="concept-stat__label">{label}</span>
    </div>
  );
}

export default function Concept() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  return (
    <section className="section section--alt concept" id="concept" aria-labelledby="concept-heading">
      <div
        className="concept__parallax"
        aria-hidden="true"
        style={{ backgroundImage: `url(${conceptParallax})` }}
      />
      <div className="container concept__grid">
        <RevealOnScroll className="concept__media">
          <img src={conceptImage} alt="" loading="lazy" width={900} height={1120} />
          <figcaption className="concept__quote">
            <span className="concept__quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote>{t('home.conceptQuote')}</blockquote>
            <cite>{t('home.conceptQuoteBy')}</cite>
          </figcaption>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="concept__text">
          <span className="eyebrow">{t('home.conceptEyebrow')}</span>
          <h2 id="concept-heading">{t('home.conceptTitle')}</h2>
          <p>{t('home.conceptText1')}</p>
          <p>{t('home.conceptText2')}</p>

          <div className="concept__stats">
            {conceptStats.map((stat) => (
              <Stat
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={localized(stat.label, lang)}
              />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
