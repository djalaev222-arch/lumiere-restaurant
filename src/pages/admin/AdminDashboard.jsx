import { useEffect, useState } from 'react';
import { fetchStats } from '../../lib/adminApi';
import StatCard from '../../components/admin/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setError('Не удалось загрузить статистику'));
  }, []);

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Дашборд</h1>
          <p>Обзор броней и заказов в реальном времени</p>
        </div>
      </header>

      {error && <p className="admin-error-banner">{error}</p>}

      {stats && (
        <div className="admin-stats">
          <StatCard label="Заказы сегодня" value={stats.today.orders} />
          <StatCard label="Выручка сегодня" value={`${stats.today.revenue.toLocaleString('ru-RU')} ₽`} />
          <StatCard label="Заказы за 7 дней" value={stats.week.orders} />
          <StatCard label="Выручка за 7 дней" value={`${stats.week.revenue.toLocaleString('ru-RU')} ₽`} />
          <StatCard label="Новые брони" value={stats.pendingBookings} />
          <StatCard label="Активные заказы" value={stats.activeOrders} />
        </div>
      )}
    </>
  );
}
