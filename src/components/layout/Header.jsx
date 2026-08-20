import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX, FiShoppingBag } from 'react-icons/fi';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { getCartItemCount } from '../../lib/cart';
import './header.css';

const NAV_ITEMS = [
  { to: '/', key: 'home', end: true },
  { to: '/menu', key: 'menu' },
  { to: '/booking', key: 'booking' },
  { to: '/delivery', key: 'delivery' },
  { to: '/about', key: 'about' },
  { to: '/contacts', key: 'contacts' },
];

export default function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const itemCount = useMemo(() => getCartItemCount(cartItems), [cartItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__logo" onClick={() => setMenuOpen(false)}>
          Lumi&egrave;re
        </NavLink>

        <nav className="site-header__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `site-header__link ${isActive ? 'is-active' : ''}`}
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher className="site-header__lang" />
          <NavLink to="/delivery" className="site-header__cart" aria-label={t('nav.delivery')}>
            <FiShoppingBag size={20} />
            {itemCount > 0 && <span className="site-header__cart-badge">{itemCount}</span>}
          </NavLink>
          <Button to="/booking" size="sm" className="site-header__cta">
            {t('common.bookTable')}
          </Button>
          <button
            type="button"
            className="site-header__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.nav
              className="mobile-nav__panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `mobile-nav__link ${isActive ? 'is-active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                </motion.div>
              ))}
              <Button to="/booking" variant="primary" className="btn--full" onClick={() => setMenuOpen(false)}>
                {t('common.bookTable')}
              </Button>
            </motion.nav>
            <button
              className="mobile-nav__backdrop"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
