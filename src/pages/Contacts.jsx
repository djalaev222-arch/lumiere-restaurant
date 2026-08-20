import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock, FiPhone, FiMail } from 'react-icons/fi';
import SeoHead from '../components/ui/SeoHead';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import { useSettings } from '../hooks/useSettings';
import './contacts.css';

const MAP_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=37.5917%2C55.7608%2C37.6117%2C55.7708&layer=mapnik&marker=55.7658%2C37.6017';

export default function Contacts() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const address = settings?.address || t('common.address');
  const phone = settings?.phone || t('common.phone');
  const hours = settings?.hoursText || t('contacts.hoursValue');
  const email = settings?.email || t('contacts.emailValue');

  const cards = [
    { icon: FiMapPin, title: t('contacts.addressTitle'), value: address },
    { icon: FiClock, title: t('contacts.hoursTitle'), value: hours },
    { icon: FiPhone, title: t('contacts.phoneTitle'), value: phone, href: `tel:${phone.replace(/[^+\d]/g, '')}` },
    { icon: FiMail, title: t('contacts.emailTitle'), value: email, href: `mailto:${email}` },
  ];

  return (
    <>
      <SeoHead title={t('contacts.title')} description={t('contacts.subtitle')} path="/contacts" />

      <section className="contacts-page">
        <div className="container">
          <header className="contacts-page__head">
            <span className="eyebrow">{t('nav.contacts')}</span>
            <h1>{t('contacts.title')}</h1>
            <p>{t('contacts.subtitle')}</p>
          </header>

          <div className="contacts-page__grid">
            {cards.map((card, index) => (
              <RevealOnScroll key={card.title} delay={index * 0.06} className="contact-card">
                <div className="contact-card__head">
                  <card.icon size={18} />
                  <h3>{card.title}</h3>
                </div>
                {card.href ? <a href={card.href}>{card.value}</a> : <p>{card.value}</p>}
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.15} className="contacts-page__map">
            <h2>{t('contacts.mapTitle')}</h2>
            <div className="contacts-page__map-frame">
              <iframe
                title={t('contacts.mapTitle')}
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
