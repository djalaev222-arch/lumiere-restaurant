import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import './menu-filters.css';

const TAGS = ['vegetarian', 'spicy', 'chefChoice'];

export default function MenuFilters({ search, onSearch, categories, category, onCategory, tag, onTag }) {
  const { t } = useTranslation();

  return (
    <div className="menu-filters">
      <label className="menu-filters__search">
        <FiSearch size={18} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('menu.searchPlaceholder')}
          aria-label={t('menu.searchPlaceholder')}
        />
      </label>

      <div className="menu-filters__row" role="tablist" aria-label="Категории">
        <button
          type="button"
          className={`menu-filters__pill ${category === 'all' ? 'is-active' : ''}`}
          onClick={() => onCategory('all')}
        >
          {t('menu.filters.all')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`menu-filters__pill ${category === cat ? 'is-active' : ''}`}
            onClick={() => onCategory(cat)}
          >
            {t(`menu.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="menu-filters__row menu-filters__row--tags">
        {TAGS.map((t2) => (
          <button
            key={t2}
            type="button"
            className={`menu-filters__chip ${tag === t2 ? 'is-active' : ''}`}
            onClick={() => onTag(tag === t2 ? null : t2)}
          >
            {t(`menu.filters.${t2}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
