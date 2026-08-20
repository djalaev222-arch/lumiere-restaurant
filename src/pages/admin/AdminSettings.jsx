import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../../lib/adminApi';
import Button from '../../components/ui/Button';

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(setForm)
      .catch(() => setError('Не удалось загрузить настройки'))
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateSettings({
        hoursText: form.hoursText,
        phone: form.phone,
        email: form.email,
        address: form.address,
        deliveryFee: Number(form.deliveryFee),
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
        aboutRu: form.aboutRu,
        aboutEn: form.aboutEn,
      });
      setForm(updated);
      setSaved(true);
    } catch {
      setError('Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Настройки</h1>
          <p>Часы работы, доставка, контакты и текст «О ресторане»</p>
        </div>
      </header>

      {error && <p className="admin-error-banner">{error}</p>}
      {loading || !form ? (
        <p className="admin-empty">Загрузка...</p>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="s-hours">Часы работы</label>
              <input id="s-hours" value={form.hoursText} onChange={(event) => update('hoursText', event.target.value)} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="s-phone">Телефон</label>
              <input id="s-phone" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="s-email">E-mail</label>
              <input id="s-email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="s-address">Адрес</label>
              <input id="s-address" value={form.address} onChange={(event) => update('address', event.target.value)} />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="s-fee">Стоимость доставки, ₽</label>
              <input
                id="s-fee"
                type="number"
                min="0"
                value={form.deliveryFee}
                onChange={(event) => update('deliveryFee', event.target.value)}
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="s-threshold">Бесплатная доставка от, ₽</label>
              <input
                id="s-threshold"
                type="number"
                min="0"
                value={form.freeDeliveryThreshold}
                onChange={(event) => update('freeDeliveryThreshold', event.target.value)}
              />
            </div>
          </div>

          <div className="admin-form__field">
            <label htmlFor="s-about-ru">О ресторане (RU)</label>
            <textarea id="s-about-ru" value={form.aboutRu} onChange={(event) => update('aboutRu', event.target.value)} />
          </div>

          <div className="admin-form__field">
            <label htmlFor="s-about-en">О ресторане (EN)</label>
            <textarea id="s-about-en" value={form.aboutEn} onChange={(event) => update('aboutEn', event.target.value)} />
          </div>

          <div className="admin-form__actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </Button>
            {saved && <span style={{ color: 'var(--color-success)', alignSelf: 'center' }}>Сохранено</span>}
          </div>
        </form>
      )}
    </>
  );
}
