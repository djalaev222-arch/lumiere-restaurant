import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  fetchAdminDishes,
  fetchAdminCategories,
  createDish,
  updateDish,
  deleteDish,
} from '../../lib/adminApi';
import DishForm from '../../components/admin/DishForm';
import Button from '../../components/ui/Button';

export default function AdminMenu() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchAdminDishes(), fetchAdminCategories()])
      .then(([dishList, categoryList]) => {
        setDishes(dishList);
        setCategories(categoryList);
      })
      .catch(() => setError('Не удалось загрузить меню'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name.ru || id;

  const handleToggleAvailable = async (dish) => {
    const previous = dishes;
    setDishes((rows) => rows.map((row) => (row.id === dish.id ? { ...row, isAvailable: !row.isAvailable } : row)));
    try {
      await updateDish(dish.id, { isAvailable: !dish.isAvailable });
    } catch {
      setDishes(previous);
      setError('Не удалось изменить наличие блюда');
    }
  };

  const handleDelete = async (dish) => {
    if (!window.confirm(`Удалить блюдо «${dish.name.ru}»?`)) return;
    try {
      await deleteDish(dish.id);
      setDishes((rows) => rows.filter((row) => row.id !== dish.id));
    } catch (deleteError) {
      setError(deleteError.message || 'Не удалось удалить блюдо');
    }
  };

  const handleFormSubmit = async (payload) => {
    if (editingDish) {
      const updated = await updateDish(editingDish.id, payload);
      setDishes((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
    } else {
      const created = await createDish(payload);
      setDishes((rows) => [...rows, created]);
    }
    setFormOpen(false);
    setEditingDish(null);
  };

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Меню</h1>
          <p>{dishes.length} блюд в базе</p>
        </div>
        <Button
          icon={<FiPlus size={16} />}
          onClick={() => {
            setEditingDish(null);
            setFormOpen(true);
          }}
        >
          Добавить блюдо
        </Button>
      </header>

      {error && <p className="admin-error-banner">{error}</p>}

      {formOpen && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <DishForm
            dish={editingDish}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditingDish(null);
            }}
          />
        </div>
      )}

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Загрузка...</p>
        ) : dishes.length === 0 ? (
          <p className="admin-empty">Блюд пока нет</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Блюдо</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>В наличии</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish.id}>
                  <td>
                    {dish.name.ru}
                    <div className="admin-table__muted">{dish.id}</div>
                  </td>
                  <td>{categoryName(dish.category)}</td>
                  <td>{dish.price.toLocaleString('ru-RU')} ₽</td>
                  <td>
                    <label className="admin-form__checkbox">
                      <input type="checkbox" checked={dish.isAvailable} onChange={() => handleToggleAvailable(dish)} />
                    </label>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        aria-label="Редактировать"
                        onClick={() => {
                          setEditingDish(dish);
                          setFormOpen(true);
                        }}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        aria-label="Удалить"
                        onClick={() => handleDelete(dish)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
