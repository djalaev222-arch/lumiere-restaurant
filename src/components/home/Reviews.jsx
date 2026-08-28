import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiStar, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { reviews } from '../../data/reviews';
import { localized } from '../../lib/format';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './reviews.css';

const PER_CARD = 2;

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const cards = chunk(reviews, PER_CARD);

  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(cards.length - 1, index)));
  }, [cards.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    track.addEventListener('scroll', syncActive, { passive: true });
    return () => track.removeEventListener('scroll', syncActive);
  }, [syncActive]);

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
    setActive(clamped);
  };

  return (
    <section className="reviews">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.reviewsEyebrow')}
          title={t('home.reviewsTitle')}
          align="center"
        />

        <div className="reviews__carousel">
          <button
            type="button"
            className="reviews__arrow reviews__arrow--prev"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label={lang === 'ru' ? 'Предыдущие отзывы' : 'Previous reviews'}
          >
            <FiArrowLeft size={18} />
          </button>

          <div className="reviews__track" ref={trackRef}>
            {cards.map((card, cardIndex) => (
              <div className="reviews__card" key={cardIndex} aria-hidden={active !== cardIndex}>
                {card.map((review) => (
                  <figure className="review" key={review.id}>
                    <div className="review__stars" aria-label={`${review.rating}/5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          size={13}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          className={i < review.rating ? 'is-filled' : ''}
                        />
                      ))}
                    </div>
                    <blockquote className="review__text">
                      {localized(review.text, lang)}
                    </blockquote>
                    <figcaption className="review__by">
                      <span className="review__name">{review.name}</span>
                      <span className="review__occasion">{localized(review.occasion, lang)}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="reviews__arrow reviews__arrow--next"
            onClick={() => goTo(active + 1)}
            disabled={active === cards.length - 1}
            aria-label={lang === 'ru' ? 'Следующие отзывы' : 'Next reviews'}
          >
            <FiArrowRight size={18} />
          </button>
        </div>

        <div className="reviews__dots" role="tablist">
          {cards.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`reviews__dot ${active === index ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`${index + 1}`}
              aria-selected={active === index}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
