import { useCallback, useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';

const STATUSES = ['NEW', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];
const FILTERS = [{ value: '', label: 'Все' }, ...STATUSES.map((s) => ({ value: s, label: s }))];

const PAYMENT_LABELS = { ONLINE: 'Онлайн', CASH: 'Наличные' };
const METHOD_LABELS = { DELIVERY: 'Доставка', PICKUP: 'Самовывоз' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchOrders(status ? { status } : {})
      .then(setOrders)
      .catch(() => setError('Не удалось загрузить заказы'))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, nextStatus) => {
    const previous = orders;
    setOrders((rows) => rows.map((row) => (row.id === id ? { ...row, status: nextStatus } : row)));
    try {
      await updateOrderStatus(id, nextStatus);
    } catch {
      setOrders(previous);
      setError('Не удалось обновить статус заказа');
    }
  };

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Заказы</h1>
          <p>Заказы на доставку и самовывоз</p>
        </div>
      </header>

      {error && <p className="admin-error-banner">{error}</p>}

      <div className="admin-filters">
        {FILTERS.map((filter) => (
          <button
            key={filter.value || 'all'}
            type="button"
            className={`admin-filters__pill ${status === filter.value ? 'is-active' : ''}`}
            onClick={() => setStatus(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Загрузка...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">Заказов нет</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Клиент</th>
                <th>Состав</th>
                <th>Способ</th>
                <th>Оплата</th>
                <th>Итого</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {order.name}
                    <div className="admin-table__muted">{order.phone}</div>
                    {order.email && <div className="admin-table__muted">{order.email}</div>}
                    {order.address && <div className="admin-table__muted">{order.address}</div>}
                  </td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item.dishId} className="admin-table__muted">
                        {item.qty}&times; {item.name}
                      </div>
                    ))}
                  </td>
                  <td>{METHOD_LABELS[order.method] || order.method}</td>
                  <td>
                    {PAYMENT_LABELS[order.payment] || order.payment}
                    {order.payment === 'ONLINE' && (
                      <div style={{ marginTop: 4 }}>
                        <StatusBadge status={order.paymentStatus} />
                      </div>
                    )}
                  </td>
                  <td>{order.total.toLocaleString('ru-RU')} ₽</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
