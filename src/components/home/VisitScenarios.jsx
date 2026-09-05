import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import RevealOnScroll from '../ui/RevealOnScroll';
import { visitScenarios } from '../../data/landing';
import { localized } from '../../lib/format';
import './visit-scenarios.css';

export default function VisitScenarios() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  return (
    <section className="section scenarios" id="scenarios" aria-labelledby="scenarios-heading">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.scenariosEyebrow')}
          title={t('home.scenariosTitle')}
          titleId="scenarios-heading"
          className="scenarios__heading"
        />

        <ul className="scenarios__grid">
          {visitScenarios.map((scenario, index) => (
            <RevealOnScroll
              as="li"
              key={scenario.id}
              delay={Math.min(index * 0.08, 0.32)}
              className={`scenario-card scenario-card--${index % 2 === 0 ? 'lifted' : 'lower'}`}
            >
              <a className="scenario-card__link" href="#menu">
                <div className="scenario-card__media">
                  <img
                    src={scenario.image}
                    alt={localized(scenario.title, lang)}
                    loading="eager"
                    decoding="async"
                    width={900}
                    height={1100}
                  />
                  <span className="scenario-card__time">{scenario.time}</span>
                </div>
                <div className="scenario-card__body">
                  <h3>{localized(scenario.title, lang)}</h3>
                  <p>{localized(scenario.text, lang)}</p>
                  <span className="scenario-card__cta">{t('home.scenariosCta')}</span>
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
