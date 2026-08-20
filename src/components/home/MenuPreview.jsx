import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import DishCard from '../menu/DishCard';
import { useMenu } from '../../hooks/useMenu';
import './menu-preview.css';

export default function MenuPreview() {
  const { t } = useTranslation();
  const { dishes, status } = useMenu();
  const featured = dishes.filter((dish) => dish.isFeatured);

  if (status !== 'success' || featured.length === 0) return null;

  return (
    <section className="menu-preview">
      <div className="container">
        <div className="menu-preview__head">
          <SectionHeading
            eyebrow={t('home.menuPreviewEyebrow')}
            title={t('home.menuPreviewTitle')}
          />
          <Button to="/menu" variant="outline">
            {t('common.viewMenu')}
          </Button>
        </div>

        <div className="menu-preview__grid">
          {featured.map((dish, index) => (
            <DishCard key={dish.id} dish={dish} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
