import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import Hero from '../components/home/Hero';
import Advantages from '../components/home/Advantages';
import MenuPreview from '../components/home/MenuPreview';
import Reviews from '../components/home/Reviews';
import CtaBanner from '../components/home/CtaBanner';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <SeoHead title={t('home.heroEyebrow')} description={t('home.heroSubtitle')} path="/" />
      <Hero />
      <Advantages />
      <MenuPreview />
      <Reviews />
      <CtaBanner />
    </>
  );
}
