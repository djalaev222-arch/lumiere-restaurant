import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import SeoHead from '../components/ui/SeoHead';
import Button from '../components/ui/Button';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import CartLine from '../components/delivery/CartLine';
import CartSummary from '../components/delivery/CartSummary';
import CheckoutForm from '../components/delivery/CheckoutForm';
import { useCartStore } from '../store/cartStore';
import { useMenu } from '../hooks/useMenu';
import { getCartLines, getCartSubtotal } from '../lib/cart';
import { createOrder } from '../lib/api';
import './delivery.css';

export default function Delivery() {
  const { t } = useTranslation();
  const cartItems = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const { dishes, status: menuStatus } = useMenu();
  const [order, setOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const lines = useMemo(() => getCartLines(cartItems, dishes), [cartItems, dishes]);
  const subtotal = useMemo(() => getCartSubtotal(lines), [lines]);

  useEffect(() => {
    if (order) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [order]);

  const handleCheckout = async (data) => {
    setCheckoutError(null);
    try {
      const result = await createOrder({
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        method: data.method,
        address: data.method === 'delivery' ? data.address : '',
        timeType: data.time,
        payment: data.payment,
        comment: data.comment || '',
        items: cartItems.map((item) => ({ dishId: item.id, qty: item.qty })),
      });
      clear();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      setOrder(result);
    } catch {
      setCheckoutError(t('common.submitError'));
    }
  };

  if (order) {
    return (
      <>
        <SeoHead title={t('delivery.title')} path="/delivery" />
        <section className="delivery-page delivery-page--center">
          <div className="container">
            <motion.div
              className="delivery-success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <FiCheckCircle size={40} />
              <h1>{t('delivery.successTitle')}</h1>
              <p>{t('delivery.successText', { id: order.id })}</p>
              {order.paymentError && <p className="delivery-page__checkout-error">{t('delivery.paymentUnavailable')}</p>}
              <Button variant="outline" onClick={() => setOrder(null)}>
                {t('delivery.newOrder')}
              </Button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  if (menuStatus === 'loading' || menuStatus === 'idle') {
    return (
      <section className="delivery-page delivery-page--center">
        <div className="container">
          <p className="delivery-empty">{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <SeoHead title={t('delivery.title')} description={t('delivery.subtitle')} path="/delivery" />
        <section className="delivery-page delivery-page--center">
          <div className="container">
            <RevealOnScroll className="delivery-empty">
              <FiShoppingBag size={40} />
              <h1>{t('delivery.emptyCart')}</h1>
              <p>{t('delivery.emptyCartHint')}</p>
              <Button to="/menu">{t('delivery.goToMenu')}</Button>
            </RevealOnScroll>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SeoHead title={t('delivery.title')} description={t('delivery.subtitle')} path="/delivery" />
      <section className="delivery-page">
        <div className="container">
          <header className="delivery-page__head">
            <span className="eyebrow">{t('nav.delivery')}</span>
            <h1>{t('delivery.title')}</h1>
          </header>

          <div className="delivery-page__grid">
            <RevealOnScroll className="delivery-cart">
              <h2>{t('delivery.cartTitle')}</h2>
              <div className="delivery-cart__lines">
                {lines.map((line) => (
                  <CartLine key={line.dish.id} dish={line.dish} qty={line.qty} />
                ))}
              </div>
              <CartSummary subtotal={subtotal} />
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <h2 className="delivery-page__checkout-title">{t('delivery.checkoutTitle')}</h2>
              {checkoutError && <p className="delivery-page__checkout-error">{checkoutError}</p>}
              <CheckoutForm onSubmit={handleCheckout} submitLabel={t('delivery.form.submit')} />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
