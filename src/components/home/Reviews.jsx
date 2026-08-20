import { useTranslation } from 'react-i18next';
import { FiStar } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import RevealOnScroll from '../ui/RevealOnScroll';
import { reviews } from '../../data/reviews';
import { localized } from '../../lib/format';
import './reviews.css';

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  return (
    <section className="reviews">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.reviewsEyebrow')}
          title={t('home.reviewsTitle')}
          align="center"
        />
        <div className="reviews__grid">
          {reviews.map((review, index) => (
            <RevealOnScroll key={review.id} delay={index * 0.08} className="review-card">
              <div className="review-card__stars" aria-label={`${review.rating}/5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    size={14}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                    className={i < review.rating ? 'is-filled' : ''}
                  />
                ))}
              </div>
              <p className="review-card__text">&ldquo;{localized(review.text, lang)}&rdquo;</p>
              <span className="review-card__name">{review.name}</span>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
