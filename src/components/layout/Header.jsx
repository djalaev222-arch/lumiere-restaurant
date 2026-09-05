import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX, FiShoppingBag, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { getCartItemCount } from '../../lib/cart';
import { useActiveSection } from '../../hooks/useActiveSection';
import './header.css';

const SECTIONS = [
  { id: 'concept', key: 'home.navConcept' },
  { id: 'menu', key: 'home.navMenu' },
  { id: 'space', key: 'home.navSpace' },
  { id: 'events', key: 'home.navEvents' },
  { id: 'contacts', key: 'home.navContacts' },
];

// Every landing section, so the nav highlight clears (rather than going stale)
// while an untracked section like #booking is on screen.
const SECTION_IDS = [
  'scenarios',
  'concept',
  'menu',
  'space',
  'formats',
  'reviews',
  'events',
  'loyalty',
  'faq',
  'booking',
  'contacts',
];
const TELEGRAM_URL = 'https://t.me/lumiere_moscow';
const WHATSAPP_URL = 'https://wa.me/74950001234';

export default function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const itemCount = useMemo(() => getCartItemCount(cartItems), [cartItems]);
  const activeSection = useActiveSection(SECTION_IDS);

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

  const hrefFor = (id) => (isLanding ? `#${id}` : `/#${id}`);
  const bookHref = isLanding ? '#booking' : '/#booking';

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__logo" onClick={() => setMenuOpen(false)}>
          Lumi&egrave;re
        </NavLink>

        <nav className="site-header__nav" aria-label="Main navigation">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={hrefFor(section.id)}
              className={`site-header__link ${
                isLanding && activeSection === section.id ? 'is-active' : ''
              }`}
            >
              {t(section.key)}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <div className="site-header__messengers">
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t('common.telegram')}>
              <FiSend size={17} />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={t('common.whatsapp')}>
              <FaWhatsapp size={17} />
            </a>
          </div>
          <LanguageSwitcher className="site-header__lang" />
          <NavLink to="/delivery" className="site-header__cart" aria-label={t('nav.delivery')}>
            <FiShoppingBag size={20} />
            {itemCount > 0 && <span className="site-header__cart-badge">{itemCount}</span>}
          </NavLink>
          <Button href={bookHref} size="sm" className="site-header__cta">
            {t('common.bookTable')}
          </Button>
          <button
            type="button"
            className="site-header__burger"
            onClick={() => setMenuOpen((value) => !value)}
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
              {SECTIONS.map((section, index) => (
                <motion.a
                  key={section.id}
                  href={hrefFor(section.id)}
                  className="mobile-nav__link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                >
                  {t(section.key)}
                </motion.a>
              ))}
              <Button
                href={bookHref}
                variant="primary"
                className="btn--full"
                onClick={() => setMenuOpen(false)}
              >
                {t('common.bookTable')}
              </Button>
              <div className="mobile-nav__messengers">
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <FiSend size={16} /> Telegram
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp size={16} /> WhatsApp
                </a>
              </div>
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
