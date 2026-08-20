import { useState } from 'react';
import Button from '../ui/Button';

const TAG_OPTIONS = [
  { value: 'vegetarian', label: 'Вегетарианское' },
  { value: 'spicy', label: 'Острое' },
  { value: 'chefChoice', label: 'Выбор шефа' },
];

function toFormState(dish) {
  return {
    id: dish?.id || '',
    categoryId: dish?.category || '',
    nameRu: dish?.name?.ru || '',
    nameEn: dish?.name?.en || '',
    descriptionRu: dish?.description?.ru || '',
    descriptionEn: dish?.description?.en || '',
    price: dish?.price ?? '',
    weight: dish?.weight ?? '',
    image: dish?.image || '',
    tags: dish?.tags || [],
    allergens: (dish?.allergens || []).join(', '),
    isAvailable: dish?.isAvailable ?? true,
    isFeatured: dish?.isFeatured ?? false,
  };
}

export default function DishForm({ dish, categories, onSubmit, onCancel }) {
  const isEditing = Boolean(dish);
  const [form, setForm] = useState(() => toFormState(dish));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        ...(isEditing ? {} : { id: form.id.trim() }),
        categoryId: form.categoryId,
        nameRu: form.nameRu.trim(),
        nameEn: form.nameEn.trim(),
        descriptionRu: form.descriptionRu.trim(),
        descriptionEn: form.descriptionEn.trim(),
        price: Number(form.price),
        weight: Number(form.weight),
        image: form.image.trim(),
        tags: form.tags,
        allergens: form.allergens
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
      });
    } catch (submitError) {
      setError(submitError.message || 'Не удалось сохранить блюдо');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <p className="admin-error-banner">{error}</p>}

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="dish-id">ID (латиницей, через дефис)</label>
          <input
            id="dish-id"
            required
            disabled={isEditing}
            pattern="[a-z0-9\-]+"
            value={form.id}
            onChange={(event) => update('id', event.target.value)}
            placeholder="grilled-salmon"
          />
        </div>
        <div className="admin-form__field">
          <label htmlFor="dish-category">Категория</label>
          <select
            id="dish-category"
            required
            value={form.categoryId}
            onChange={(event) => update('categoryId', event.target.value)}
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.ru}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="dish-name-ru">Название (RU)</label>
          <input id="dish-name-ru" required value={form.nameRu} onChange={(event) => update('nameRu', event.target.value)} />
        </div>
        <div className="admin-form__field">
          <label htmlFor="dish-name-en">Название (EN)</label>
          <input id="dish-name-en" required value={form.nameEn} onChange={(event) => update('nameEn', event.target.value)} />
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="dish-desc-ru">Описание (RU)</label>
          <textarea
            id="dish-desc-ru"
            required
            value={form.descriptionRu}
            onChange={(event) => update('descriptionRu', event.target.value)}
          />
        </div>
        <div className="admin-form__field">
          <label htmlFor="dish-desc-en">Описание (EN)</label>
          <textarea
            id="dish-desc-en"
            required
            value={form.descriptionEn}
            onChange={(event) => update('descriptionEn', event.target.value)}
          />
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="dish-price">Цена, ₽</label>
          <input
            id="dish-price"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(event) => update('price', event.target.value)}
          />
        </div>
        <div className="admin-form__field">
          <label htmlFor="dish-weight">Вес/объём, г</label>
          <input
            id="dish-weight"
            type="number"
            min="0"
            required
            value={form.weight}
            onChange={(event) => update('weight', event.target.value)}
          />
        </div>
      </div>

      <div className="admin-form__field">
        <label htmlFor="dish-image">Ссылка на фото</label>
        <input
          id="dish-image"
          type="url"
          required
          value={form.image}
          onChange={(event) => update('image', event.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="admin-form__field">
        <label htmlFor="dish-allergens">Аллергены (через запятую)</label>
        <input
          id="dish-allergens"
          value={form.allergens}
          onChange={(event) => update('allergens', event.target.value)}
          placeholder="dairy, nuts, gluten"
        />
      </div>

      <div className="admin-form__field">
        <label>Отметки</label>
        <div className="admin-form__row" style={{ gridTemplateColumns: 'repeat(3, auto)' }}>
          {TAG_OPTIONS.map((tag) => (
            <label key={tag.value} className="admin-form__checkbox">
              <input type="checkbox" checked={form.tags.includes(tag.value)} onChange={() => toggleTag(tag.value)} />
              {tag.label}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-form__row" style={{ gridTemplateColumns: 'repeat(2, auto)' }}>
        <label className="admin-form__checkbox">
          <input type="checkbox" checked={form.isAvailable} onChange={(event) => update('isAvailable', event.target.checked)} />
          В наличии
        </label>
        <label className="admin-form__checkbox">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => update('isFeatured', event.target.checked)} />
          Показывать на главной
        </label>
      </div>

      <div className="admin-form__actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Сохраняем...' : isEditing ? 'Сохранить изменения' : 'Добавить блюдо'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
