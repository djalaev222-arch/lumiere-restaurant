import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock, FiPhone, FiMail } from 'react-icons/fi';
import RevealOnScroll from '../ui/RevealOnScroll';
import Button from '../ui/Button';
import { useSettings } from '../../hooks/useSettings';
import './contacts-section.css';

const MAP_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=37.5917%2C55.7608%2C37.6117%2C55.7708&layer=mapnik&marker=55.7658%2C37.6017';

export default function ContactsSection() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const address = settings?.address || t('common.address');
  const phone = settings?.phone || t('common.phone');
  const hours = settings?.hoursText || t('contacts.hoursValue');
  const email = settings?.email || t('contacts.emailValue');

  const rows = [
    { icon: FiMapPin, title: t('contacts.addressTitle'), value: address },
    { icon: FiClock, title: t('contacts.hoursTitle'), value: hours },
    { icon: FiPhone, title: t('contacts.phoneTitle'), value: phone, href: `tel:${phone.replace(/[^+\d]/g, '')}` },
    { icon: FiMail, title: t('contacts.emailTitle'), value: email, href: `mailto:${email}` },
  ];

  return (
    <section className="section section--alt contacts-section" id="contacts" aria-labelledby="contacts-heading">
      <div className="container contacts-section__grid">
        <RevealOnScroll className="contacts-section__info">
          <span className="eyebrow">{t('home.contactsEyebrow')}</span>
          <h2 id="contacts-heading">{t('home.contactsTitle')}</h2>

          <ul className="contacts-section__list">
            {rows.map((row) => (
              <li key={row.title}>
                <span className="contacts-section__row-icon">
                  <row.icon size={16} aria-hidden="true" />
                </span>
                <span className="contacts-section__row-title">{row.title}</span>
                {row.href ? <a href={row.href}>{row.value}</a> : <span>{row.value}</span>}
              </li>
            ))}
          </ul>

          <Button href="#booking" variant="primary">
            {t('home.contactsCta')}
          </Button>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="contacts-section__map">
          <span className="visually-hidden">{t('home.contactsMapTitle')}</span>
          <iframe
            title={t('home.contactsMapTitle')}
            src={MAP_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
