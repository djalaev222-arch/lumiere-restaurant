import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import Button from '../components/ui/Button';
import './not-found.css';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <SeoHead title={t('notFound.title')} path="/404" />
      <section className="not-found">
        <div className="container not-found__inner">
          <span className="not-found__code">404</span>
          <h1>{t('notFound.title')}</h1>
          <p>{t('notFound.text')}</p>
          <Button to="/">{t('notFound.cta')}</Button>
        </div>
      </section>
    </>
  );
}
