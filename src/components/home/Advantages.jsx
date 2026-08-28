import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiAward, FiFeather, FiTruck, FiUsers } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './advantages.css';

const ICONS = [FiAward, FiFeather, FiTruck, FiUsers];

export default function Advantages() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const advantages = t('home.advantages', { returnObjects: true });

  return (
    <section className="advantages">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.advantagesEyebrow')}
          title={t('home.advantagesTitle')}
          align="center"
          wide
        />

        <div className="advantages__grid">
          {advantages.map((advantage, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.article
                key={advantage.title}
                className="advantage-card"
                initial={{ opacity: 0, y: reduced ? 0 : 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.6, delay: reduced ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="advantage-card__top">
                  <span className="advantage-card__num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="advantage-card__icon">
                    <Icon size={20} />
                  </span>
                </div>
                <h3>{advantage.title}</h3>
                <p>{advantage.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
