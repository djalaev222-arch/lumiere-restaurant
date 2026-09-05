import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import CursorDot from '../components/ui/CursorDot';
import MobileBookingBar from '../components/layout/MobileBookingBar';
import Hero from '../components/home/Hero';
import VisitScenarios from '../components/home/VisitScenarios';
import Concept from '../components/home/Concept';
import MenuSection from '../components/home/MenuSection';
import Space from '../components/home/Space';
import SpecialFormats from '../components/home/SpecialFormats';
import Reviews from '../components/home/Reviews';
import Events from '../components/home/Events';
import Loyalty from '../components/home/Loyalty';
import Faq from '../components/home/Faq';
import BookingSection from '../components/home/BookingSection';
import ContactsSection from '../components/home/ContactsSection';

export default function Home() {
  const { t } = useTranslation();
  const { hash } = useLocation();

  // Honour /#section links arriving from other routes.
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [hash]);

  return (
    <>
      <SeoHead title={t('home.heroEyebrow')} description={t('home.heroSubtitle')} path="/" />
      <CursorDot />
      <Hero />
      <VisitScenarios />
      <Concept />
      <MenuSection />
      <Space />
      <SpecialFormats />
      <Reviews />
      <Events />
      <Loyalty />
      <Faq />
      <BookingSection />
      <ContactsSection />
      <MobileBookingBar />
    </>
  );
}
