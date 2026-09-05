import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import RevealOnScroll from '../ui/RevealOnScroll';
import { events, formatEventDate } from '../../data/landing';
import { localized } from '../../lib/format';
import './events.css';

export default function Events() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  return (
    <section className="section events" id="events" aria-labelledby="events-heading">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.eventsEyebrow')}
          title={t('home.eventsTitle')}
          titleId="events-heading"
        />

        <ul className="events__grid">
          {events.map((event, index) => (
            <RevealOnScroll
              as="li"
              key={event.id}
              delay={Math.min(index * 0.08, 0.24)}
              className="event-card"
            >
              <article>
                <div className="event-card__media">
                  <img
                    src={event.image}
                    alt={localized(event.title, lang)}
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={640}
                  />
                  <span className="event-card__soon">{t('home.eventsSoon')}</span>
                </div>
                <time className="event-card__date" dateTime={event.date}>
                  {formatEventDate(event.date, lang)}
                </time>
                <h3>{localized(event.title, lang)}</h3>
                <p>{localized(event.text, lang)}</p>
              </article>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
