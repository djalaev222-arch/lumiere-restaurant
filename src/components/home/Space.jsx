import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { spaceGallery } from '../../data/landing';
import { localized } from '../../lib/format';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './space.css';

export default function Space() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const reduced = useReducedMotion();
  const trackRef = useRef(null);

  const scrollByCard = useCallback(
    (direction) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector('.space-slide');
      const amount = card ? card.clientWidth + 24 : track.clientWidth * 0.8;
      track.scrollBy({ left: direction * amount, behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );

  return (
    <section className="section space" id="space" aria-labelledby="space-heading">
      <div className="container space__head">
        <SectionHeading
          eyebrow={t('home.spaceEyebrow')}
          title={t('home.spaceTitle')}
          titleId="space-heading"
        />
        <div className="space__controls">
          <button
            type="button"
            className="space__arrow"
            onClick={() => scrollByCard(-1)}
            aria-label={lang === 'ru' ? 'Назад' : 'Previous'}
          >
            <FiArrowLeft size={18} />
          </button>
          <button
            type="button"
            className="space__arrow"
            onClick={() => scrollByCard(1)}
            aria-label={lang === 'ru' ? 'Вперёд' : 'Next'}
          >
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="space__track" ref={trackRef}>
        {spaceGallery.map((item, index) => (
          <figure className="space-slide" key={item.src}>
            <img
              src={item.src}
              alt={localized(item.caption, lang)}
              loading={index < 2 ? 'eager' : 'lazy'}
              width={1100}
              height={1400}
            />
            <figcaption>
              <span className="space-slide__num">{String(index + 1).padStart(2, '0')}</span>
              {localized(item.caption, lang)}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="space__hint">{t('home.spaceHint')}</p>
    </section>
  );
}
