import { useTranslation } from 'react-i18next';
import { FiAward, FiFeather, FiTruck, FiUsers } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import RevealOnScroll from '../ui/RevealOnScroll';
import './advantages.css';

const ICONS = [FiAward, FiFeather, FiTruck, FiUsers];

export default function Advantages() {
  const { t } = useTranslation();
  const advantages = t('home.advantages', { returnObjects: true });

  return (
    <section className="advantages">
      <div className="container">
        <SectionHeading
          eyebrow={t('home.advantagesEyebrow')}
          title={t('home.advantagesTitle')}
          align="center"
        />
        <div className="advantages__grid">
          {advantages.map((advantage, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <RevealOnScroll key={advantage.title} delay={index * 0.08} className="advantage-card">
                <div className="advantage-card__icon">
                  <Icon size={22} />
                </div>
                <h3>{advantage.title}</h3>
                <p>{advantage.text}</p>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
