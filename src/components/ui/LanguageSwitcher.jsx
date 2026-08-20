import { useTranslation } from 'react-i18next';
import './language-switcher.css';

const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language || 'ru';

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label="Language">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`lang-switch__btn ${current.startsWith(lang.code) ? 'is-active' : ''}`}
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-pressed={current.startsWith(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
