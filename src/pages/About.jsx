import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import SectionHeading from '../components/ui/SectionHeading';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import { useSettings } from '../hooks/useSettings';
import './about.css';

const TEAM = [
  { id: 1, name: 'Алексей Воронов', role: { ru: 'Шеф-повар', en: 'Head chef' }, seed: 'chef-alexey' },
  { id: 2, name: 'Мария Донцова', role: { ru: 'Су-шеф', en: 'Sous chef' }, seed: 'chef-maria' },
  { id: 3, name: 'Никита Орлов', role: { ru: 'Шеф-кондитер', en: 'Pastry chef' }, seed: 'chef-nikita' },
  { id: 4, name: 'Елена Гроза', role: { ru: 'Директор ресторана', en: 'Restaurant manager' }, seed: 'manager-elena' },
];

const GALLERY_SEEDS = ['interior-1', 'interior-2', 'interior-3', 'interior-4', 'interior-5', 'interior-6'];

export default function About() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const aboutText = lang === 'en' ? settings?.aboutEn : settings?.aboutRu;

  return (
    <>
      <SeoHead title={t('about.title')} description={aboutText || t('about.storyText1')} path="/about" />

      <section className="about-story">
        <div className="container about-story__grid">
          <RevealOnScroll className="about-story__media">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=675&q=80&auto=format&fit=crop"
              alt=""
              loading="lazy"
              width={900}
              height={675}
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="about-story__text">
            <span className="eyebrow">{t('about.storyEyebrow')}</span>
            <h1>{t('about.storyTitle')}</h1>
            {aboutText ? (
              <p>{aboutText}</p>
            ) : (
              <>
                <p>{t('about.storyText1')}</p>
                <p>{t('about.storyText2')}</p>
              </>
            )}
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <SectionHeading eyebrow={t('about.teamEyebrow')} title={t('about.teamTitle')} align="center" />
          <div className="about-team__grid">
            {TEAM.map((member, index) => (
              <RevealOnScroll key={member.id} delay={index * 0.06} className="team-card">
                <img
                  src={`https://picsum.photos/seed/${member.seed}/500/600`}
                  alt={member.name}
                  loading="lazy"
                  width={500}
                  height={600}
                />
                <h3>{member.name}</h3>
                <span>{member.role[lang] ?? member.role.ru}</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="about-gallery">
        <div className="container">
          <SectionHeading eyebrow={t('about.galleryEyebrow')} title={t('about.galleryTitle')} align="center" />
          <div className="about-gallery__grid">
            {GALLERY_SEEDS.map((seed, index) => (
              <RevealOnScroll key={seed} delay={index * 0.05} className="about-gallery__item">
                <img src={`https://picsum.photos/seed/${seed}/700/700`} alt="" loading="lazy" width={700} height={700} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
