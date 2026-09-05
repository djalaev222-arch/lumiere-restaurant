import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle } from 'react-icons/fi';
import Button from '../ui/Button';
import { createBooking } from '../../lib/api';
import { bookingFormats } from '../../data/landing';
import './booking-form.css';

const todayIso = () => new Date().toISOString().split('T')[0];

const GUEST_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);
const TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const hour = 12 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour % 24).padStart(2, '0')}:${minute}`;
});

function buildSchema(t) {
  return yup.object({
    name: yup.string().trim().min(2, t('booking.form.required')).required(t('booking.form.required')),
    phone: yup
      .string()
      .trim()
      .matches(/^[+\d][\d\s()-]{7,}$/, t('booking.form.invalidPhone'))
      .required(t('booking.form.required')),
    email: yup.string().trim().email(t('booking.form.invalidEmail')).notRequired(),
    date: yup
      .string()
      .required(t('booking.form.required'))
      .test('not-past', t('booking.form.pastDate'), (value) => !value || value >= todayIso()),
    time: yup.string().required(t('booking.form.required')),
    guests: yup
      .number()
      .typeError(t('booking.form.invalidGuests'))
      .min(1, t('booking.form.invalidGuests'))
      .max(20, t('booking.form.invalidGuests'))
      .required(t('booking.form.required')),
    format: yup.string().notRequired(),
    comment: yup.string().notRequired(),
    company: yup.string().max(0),
  });
}

export default function BookingForm() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const schema = buildSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { date: todayIso(), guests: 2, format: '' },
  });

  const onSubmit = async ({ format, comment, ...rest }) => {
    setSubmitError(null);
    // The API keeps a fixed booking schema — fold the visit format into the
    // free-text comment rather than adding a new field on the wire.
    const formatNote = format ? `${t('booking.form.format')}: ${t(`booking.formats.${format}`)}` : '';
    const mergedComment = [formatNote, comment?.trim()].filter(Boolean).join('. ');

    try {
      await createBooking({ ...rest, comment: mergedComment });
      setSubmitted(true);
    } catch {
      setSubmitError(t('common.submitError'));
    }
  };

  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted]);

  if (submitted) {
    return (
      <motion.div
        className="booking-success"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <FiCheckCircle size={40} />
        <h3>{t('booking.successTitle')}</h3>
        <p>{t('booking.successText')}</p>
        <Button
          variant="outline"
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
        >
          {t('booking.newBooking')}
        </Button>
      </motion.div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="booking-form__honeypot"
        aria-hidden="true"
        {...register('company')}
      />

      <div className="booking-form__row">
        <div className="booking-form__field">
          <label htmlFor="name">{t('booking.form.name')}</label>
          <input id="name" type="text" placeholder={t('booking.form.namePlaceholder')} {...register('name')} />
          <AnimatePresence>{errors.name && <FieldError>{errors.name.message}</FieldError>}</AnimatePresence>
        </div>

        <div className="booking-form__field">
          <label htmlFor="phone">{t('booking.form.phone')}</label>
          <input id="phone" type="tel" placeholder={t('booking.form.phonePlaceholder')} {...register('phone')} />
          <AnimatePresence>{errors.phone && <FieldError>{errors.phone.message}</FieldError>}</AnimatePresence>
        </div>
      </div>

      <div className="booking-form__field">
        <label htmlFor="email">
          {t('booking.form.email')} <span className="booking-form__optional">({t('booking.form.emailOptional')})</span>
        </label>
        <input id="email" type="email" placeholder={t('booking.form.emailPlaceholder')} {...register('email')} />
        <AnimatePresence>{errors.email && <FieldError>{errors.email.message}</FieldError>}</AnimatePresence>
      </div>

      <div className="booking-form__row booking-form__row--three">
        <div className="booking-form__field">
          <label htmlFor="date">{t('booking.form.date')}</label>
          <input id="date" type="date" min={todayIso()} {...register('date')} />
          <AnimatePresence>{errors.date && <FieldError>{errors.date.message}</FieldError>}</AnimatePresence>
        </div>

        <div className="booking-form__field">
          <label htmlFor="time">{t('booking.form.time')}</label>
          <select id="time" defaultValue="" {...register('time')}>
            <option value="" disabled>
              --:--
            </option>
            {TIME_OPTIONS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <AnimatePresence>{errors.time && <FieldError>{errors.time.message}</FieldError>}</AnimatePresence>
        </div>

        <div className="booking-form__field">
          <label htmlFor="guests">{t('booking.form.guests')}</label>
          <select id="guests" {...register('guests')}>
            {GUEST_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <AnimatePresence>{errors.guests && <FieldError>{errors.guests.message}</FieldError>}</AnimatePresence>
        </div>
      </div>

      <div className="booking-form__field">
        <label htmlFor="format">{t('booking.form.format')}</label>
        <select id="format" defaultValue="" {...register('format')}>
          <option value="">—</option>
          {bookingFormats.map((value) => (
            <option key={value} value={value}>
              {t(`booking.formats.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="booking-form__field">
        <label htmlFor="comment">{t('booking.form.comment')}</label>
        <textarea
          id="comment"
          rows={3}
          placeholder={t('booking.form.commentPlaceholder')}
          {...register('comment')}
        />
      </div>

      {submitError && <p className="booking-form__submit-error">{submitError}</p>}

      <Button type="submit" size="lg" className="btn--full" disabled={isSubmitting}>
        {isSubmitting ? t('booking.form.submitting') : t('booking.form.submit')}
      </Button>
    </form>
  );
}

function FieldError({ children }) {
  return (
    <motion.span
      className="booking-form__error"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
}
