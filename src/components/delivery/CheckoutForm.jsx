import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import './checkout-form.css';

function buildSchema(t) {
  return yup.object({
    name: yup.string().trim().min(2, t('booking.form.required')).required(t('booking.form.required')),
    phone: yup
      .string()
      .trim()
      .matches(/^[+\d][\d\s()-]{7,}$/, t('booking.form.invalidPhone'))
      .required(t('booking.form.required')),
    email: yup.string().trim().email(t('booking.form.invalidEmail')).notRequired(),
    method: yup.string().oneOf(['delivery', 'pickup']).required(),
    address: yup.string().when('method', {
      is: 'delivery',
      then: (schema) => schema.trim().min(5, t('booking.form.required')).required(t('booking.form.required')),
      otherwise: (schema) => schema.notRequired(),
    }),
    time: yup.string().oneOf(['asap', 'scheduled']).required(),
    payment: yup.string().oneOf(['online', 'cash']).required(),
    comment: yup.string().notRequired(),
  });
}

export default function CheckoutForm({ onSubmit, submitLabel }) {
  const { t } = useTranslation();
  const schema = buildSchema(t);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { method: 'delivery', time: 'asap', payment: 'online' },
  });

  const method = useWatch({ control, name: 'method' });

  return (
    <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="checkout-form__row">
        <div className="checkout-form__field">
          <label htmlFor="c-name">{t('delivery.form.name')}</label>
          <input id="c-name" type="text" {...register('name')} />
          <AnimatePresence>{errors.name && <FieldError>{errors.name.message}</FieldError>}</AnimatePresence>
        </div>
        <div className="checkout-form__field">
          <label htmlFor="c-phone">{t('delivery.form.phone')}</label>
          <input id="c-phone" type="tel" {...register('phone')} />
          <AnimatePresence>{errors.phone && <FieldError>{errors.phone.message}</FieldError>}</AnimatePresence>
        </div>
      </div>

      <div className="checkout-form__field">
        <label htmlFor="c-email">
          {t('delivery.form.email')} <span className="checkout-form__optional">({t('booking.form.emailOptional')})</span>
        </label>
        <input id="c-email" type="email" placeholder={t('booking.form.emailPlaceholder')} {...register('email')} />
        <AnimatePresence>{errors.email && <FieldError>{errors.email.message}</FieldError>}</AnimatePresence>
      </div>

      <fieldset className="checkout-form__field">
        <legend>{t('delivery.form.method')}</legend>
        <div className="checkout-form__options">
          <label className="checkout-form__option">
            <input type="radio" value="delivery" {...register('method')} />
            {t('delivery.form.methodDelivery')}
          </label>
          <label className="checkout-form__option">
            <input type="radio" value="pickup" {...register('method')} />
            {t('delivery.form.methodPickup')}
          </label>
        </div>
      </fieldset>

      <AnimatePresence initial={false}>
        {method === 'delivery' && (
          <motion.div
            className="checkout-form__field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <label htmlFor="c-address">{t('delivery.form.address')}</label>
            <input id="c-address" type="text" placeholder={t('delivery.form.addressPlaceholder')} {...register('address')} />
            <AnimatePresence>{errors.address && <FieldError>{errors.address.message}</FieldError>}</AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <fieldset className="checkout-form__field">
        <legend>{t('delivery.form.time')}</legend>
        <div className="checkout-form__options">
          <label className="checkout-form__option">
            <input type="radio" value="asap" {...register('time')} />
            {t('delivery.form.timeAsap')}
          </label>
          <label className="checkout-form__option">
            <input type="radio" value="scheduled" {...register('time')} />
            {t('delivery.form.timeScheduled')}
          </label>
        </div>
      </fieldset>

      <fieldset className="checkout-form__field">
        <legend>{t('delivery.form.payment')}</legend>
        <div className="checkout-form__options checkout-form__options--payment">
          <label className="checkout-form__option checkout-form__option--card">
            <input type="radio" value="online" {...register('payment')} />
            {t('delivery.form.paymentOnline')}
          </label>
          <label className="checkout-form__option checkout-form__option--card">
            <input type="radio" value="cash" {...register('payment')} />
            {t('delivery.form.paymentCash')}
          </label>
        </div>
      </fieldset>

      <div className="checkout-form__field">
        <label htmlFor="c-comment">{t('delivery.form.comment')}</label>
        <textarea id="c-comment" rows={2} placeholder={t('delivery.form.commentPlaceholder')} {...register('comment')} />
      </div>

      <Button type="submit" size="lg" className="btn--full" disabled={isSubmitting}>
        {isSubmitting ? t('delivery.form.submitting') : submitLabel}
      </Button>
    </form>
  );
}

function FieldError({ children }) {
  return (
    <motion.span
      className="checkout-form__error"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
}
