import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SeoHead from '../components/ui/SeoHead';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import MenuFilters from '../components/menu/MenuFilters';
import DishCard from '../components/menu/DishCard';
import { useMenu } from '../hooks/useMenu';
import './menu.css';

export default function Menu() {
  const { t } = useTranslation();
  const { categories, dishes, status } = useMenu();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState(null);

  const categoryIds = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => c.id),
    [categories]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return dishes.filter((dish) => {
      if (category !== 'all' && dish.category !== category) return false;
      if (tag && !dish.tags.includes(tag)) return false;
      if (!query) return true;
      const name = `${dish.name.ru} ${dish.name.en}`.toLowerCase();
      const desc = `${dish.description.ru} ${dish.description.en}`.toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }, [dishes, search, category, tag]);

  const grouped = useMemo(() => {
    return categoryIds
      .map((cat) => ({ category: cat, items: filtered.filter((dish) => dish.category === cat) }))
      .filter((group) => group.items.length > 0);
  }, [categoryIds, filtered]);

  return (
    <>
      <SeoHead title={t('menu.title')} description={t('menu.subtitle')} path="/menu" />

      <section className="menu-page">
        <div className="container">
          <header className="menu-page__head">
            <span className="eyebrow">{t('nav.menu')}</span>
            <h1>{t('menu.title')}</h1>
            <p>{t('menu.subtitle')}</p>
          </header>

          {status === 'loading' && <p className="menu-page__empty">{t('common.loading')}</p>}
          {status === 'error' && <p className="menu-page__empty">{t('common.loadError')}</p>}

          {status === 'success' && (
            <>
              <MenuFilters
                search={search}
                onSearch={setSearch}
                categories={categoryIds}
                category={category}
                onCategory={setCategory}
                tag={tag}
                onTag={setTag}
              />

              {grouped.length === 0 ? (
                <p className="menu-page__empty">{t('menu.noResults')}</p>
              ) : (
                grouped.map((group) => (
                  <div key={group.category} className="menu-page__group">
                    {category === 'all' && (
                      <RevealOnScroll as="h2" className="menu-page__group-title">
                        {t(`menu.categories.${group.category}`)}
                      </RevealOnScroll>
                    )}
                    <div className="menu-page__grid">
                      {group.items.map((dish, index) => (
                        <DishCard key={dish.id} dish={dish} index={index} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
