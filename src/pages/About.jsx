import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import SectionHeading from '../components/ui/SectionHeading';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import { useSettings } from '../hooks/useSettings';
import './about.css';

const uImg = (id, w, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;

const TEAM = [
  {
    id: 1,
    name: 'Алексей Воронов',
    role: { ru: 'Шеф-повар', en: 'Head chef' },
    photo: uImg('1600565193348-f74bd3c7ccdf', 500, 620),
  },
  {
    id: 2,
    name: 'Мария Донцова',
    role: { ru: 'Су-шеф', en: 'Sous chef' },
    photo: uImg('1594744803329-e58b31de8bf5', 500, 620),
  },
  {
    id: 3,
    name: 'Никита Орлов',
    role: { ru: 'Шеф-кондитер', en: 'Pastry chef' },
    photo: uImg('1581299894007-aaa50297cf16', 500, 620),
  },
  {
    id: 4,
    name: 'Дмитрий Гроза',
    role: { ru: 'Управляющий', en: 'General manager' },
    photo: uImg('1552058544-f2b08422138a', 500, 620),
  },
];

const GALLERY = [
  uImg('1517248135467-4c7edcad34c4', 700, 700),
  uImg('1550966871-3ed3cdb5ed0c', 700, 700),
  uImg('1554118811-1e0d58224f24', 700, 700),
  uImg('1544148103-0773bf10d330', 700, 700),
  uImg('1414235077428-338989a2e8c0', 700, 700),
  uImg('1470337458703-46ad1756a187', 700, 700),
];

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
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  width={500}
                  height={620}
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
            {GALLERY.map((src, index) => (
              <RevealOnScroll key={src} delay={index * 0.05} className="about-gallery__item">
                <img src={src} alt="" loading="lazy" width={700} height={700} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
