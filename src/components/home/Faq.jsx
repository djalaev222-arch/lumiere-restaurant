import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { faq } from '../../data/landing';
import { localized } from '../../lib/format';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './faq.css';

export default function Faq() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState(faq[0].id);

  return (
    <section className="section section--alt faq" id="faq" aria-labelledby="faq-heading">
      <div className="container faq__inner">
        <SectionHeading
          eyebrow={t('home.faqEyebrow')}
          title={t('home.faqTitle')}
          titleId="faq-heading"
        />

        <ul className="faq__list">
          {faq.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.id}>
                <h3>
                  <button
                    type="button"
                    className="faq-item__q"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span>{localized(item.q, lang)}</span>
                    <FiPlus className="faq-item__icon" size={20} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-item__a"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{localized(item.a, lang)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
