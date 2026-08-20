import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import SeoHead from '../components/ui/SeoHead';
import Button from '../components/ui/Button';
import { fetchOrderPaymentStatus } from '../lib/api';
import './delivery.css';

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 25; // ~50s, generous for a webhook round trip

export default function DeliveryPaymentResult() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState('checking'); // checking | succeeded | canceled | timeout | error

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      try {
        const result = await fetchOrderPaymentStatus(orderId);
        if (cancelled) return;

        if (result.paymentStatus === 'SUCCEEDED') return setStatus('succeeded');
        if (result.paymentStatus === 'CANCELED') return setStatus('canceled');

        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) return setStatus('timeout');
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const content = {
    checking: {
      icon: <FiLoader size={40} className="delivery-payment-result__spin" />,
      title: t('delivery.payment.checkingTitle'),
      text: t('delivery.payment.checkingText'),
    },
    succeeded: {
      icon: <FiCheckCircle size={40} />,
      title: t('delivery.payment.succeededTitle'),
      text: t('delivery.payment.succeededText', { id: orderId }),
    },
    canceled: {
      icon: <FiXCircle size={40} />,
      title: t('delivery.payment.canceledTitle'),
      text: t('delivery.payment.canceledText'),
    },
    timeout: {
      icon: <FiXCircle size={40} />,
      title: t('delivery.payment.timeoutTitle'),
      text: t('delivery.payment.timeoutText'),
    },
    error: {
      icon: <FiXCircle size={40} />,
      title: t('delivery.payment.timeoutTitle'),
      text: t('delivery.payment.timeoutText'),
    },
  }[status];

  return (
    <>
      <SeoHead title={t('delivery.title')} path="/delivery/payment-result" />
      <section className="delivery-page delivery-page--center">
        <div className="container">
          <motion.div
            className="delivery-success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {content.icon}
            <h1>{content.title}</h1>
            <p>{content.text}</p>
            {status !== 'checking' && <Button to="/menu">{t('delivery.goToMenu')}</Button>}
          </motion.div>
        </div>
      </section>
    </>
  );
}
