import { useCallback, useEffect, useState } from 'react';
import { fetchBookings, updateBookingStatus } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';

const STATUSES = ['NEW', 'CONFIRMED', 'DECLINED', 'RESCHEDULED'];
const FILTERS = [{ value: '', label: 'Все' }, ...STATUSES.map((s) => ({ value: s, label: s }))];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchBookings(status ? { status } : {})
      .then(setBookings)
      .catch(() => setError('Не удалось загрузить брони'))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, nextStatus) => {
    const previous = bookings;
    setBookings((rows) => rows.map((row) => (row.id === id ? { ...row, status: nextStatus } : row)));
    try {
      await updateBookingStatus(id, nextStatus);
    } catch {
      setBookings(previous);
      setError('Не удалось обновить статус брони');
    }
  };

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Брони</h1>
          <p>Заявки на бронирование стола</p>
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
        ) : bookings.length === 0 ? (
          <p className="admin-empty">Броней нет</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Дата / время</th>
                <th>Гость</th>
                <th>Телефон</th>
                <th>Гостей</th>
                <th>Комментарий</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    {booking.date}
                    <div className="admin-table__muted">{booking.time}</div>
                  </td>
                  <td>
                    {booking.name}
                    {booking.email && <div className="admin-table__muted">{booking.email}</div>}
                  </td>
                  <td>{booking.phone}</td>
                  <td>{booking.guests}</td>
                  <td>{booking.comment || <span className="admin-table__muted">—</span>}</td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={booking.status}
                      onChange={(event) => handleStatusChange(booking.id, event.target.value)}
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
