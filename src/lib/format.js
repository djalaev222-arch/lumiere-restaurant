export function formatPrice(value, lang = 'ru') {
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}

export function localized(field, lang = 'ru') {
  if (!field) return '';
  return field[lang] ?? field.ru ?? '';
}
