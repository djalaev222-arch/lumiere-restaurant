import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiCalendar, FiPackage, FiBook, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { fetchMe, logout as logoutRequest } from '../../lib/adminApi';
import './admin.css';

const ROLE_LABELS = { ADMIN: 'Администратор', MANAGER: 'Менеджер', OPERATOR: 'Оператор' };

const NAV_ITEMS = [
  { to: '/admin', label: 'Дашборд', icon: FiGrid, end: true, roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
  { to: '/admin/bookings', label: 'Брони', icon: FiCalendar, roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
  { to: '/admin/orders', label: 'Заказы', icon: FiPackage, roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
  { to: '/admin/menu', label: 'Меню', icon: FiBook, roles: ['ADMIN', 'MANAGER'] },
  { to: '/admin/settings', label: 'Настройки', icon: FiSettings, roles: ['ADMIN', 'MANAGER'] },
];

export default function AdminLayout() {
  const { staff, status, setStaff, clear } = useAdminAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== 'unknown') return;
    fetchMe()
      .then(setStaff)
      .catch(() => clear());
  }, [status, setStaff, clear]);

  useEffect(() => {
    if (status === 'anonymous') navigate('/admin/login', { replace: true });
  }, [status, navigate]);

  if (status !== 'authenticated' || !staff) return null;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(staff.role));

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      clear();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          Lumi&egrave;re
          <span>Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__foot">
          <div className="admin-sidebar__staff">
            <strong>{staff.name}</strong>
            <span>{ROLE_LABELS[staff.role] || staff.role}</span>
          </div>
          <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
            <FiLogOut size={16} />
            Выйти
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
