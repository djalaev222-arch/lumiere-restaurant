import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiInstagram, FiFacebook, FiSend } from 'react-icons/fi';
import { useSettings } from '../../hooks/useSettings';
import './footer.css';

const NAV_ITEMS = [
  { to: '/', key: 'home' },
  { to: '/menu', key: 'menu' },
  { to: '/booking', key: 'booking' },
  { to: '/delivery', key: 'delivery' },
  { to: '/about', key: 'about' },
  { to: '/contacts', key: 'contacts' },
];

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="site-footer__logo">Lumi&egrave;re</span>
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="site-footer__col">
          <h3>{t('footer.navTitle')}</h3>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <NavLink to={item.to}>{t(`nav.${item.key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h3>{t('footer.contactTitle')}</h3>
          <ul>
            <li>{settings?.address || t('common.address')}</li>
            <li>
              <a href={`tel:${(settings?.phone || t('common.phone')).replace(/[^+\d]/g, '')}`}>
                {settings?.phone || t('common.phone')}
              </a>
            </li>
            <li>{settings?.hoursText || t('common.openHours')}</li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h3>{t('footer.socialTitle')}</h3>
          <div className="site-footer__social">
            <a href="#" aria-label="Instagram">
              <FiInstagram size={18} />
            </a>
            <a href="#" aria-label="Facebook">
              <FiFacebook size={18} />
            </a>
            <a href="#" aria-label="Telegram">
              <FiSend size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>&copy; {year} Lumi&egrave;re. {t('footer.rights')}</span>
      </div>
    </footer>
  );
}
