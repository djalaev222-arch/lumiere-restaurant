import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SITE_NAME = 'Lumière';

export default function SeoHead({ title, description, path = '' }) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME}`;
  const url = `https://lumiere-restaurant.ru${path}`;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
