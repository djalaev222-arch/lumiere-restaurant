import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { login as loginRequest } from '../../lib/adminApi';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import Button from '../../components/ui/Button';
import '../../components/admin/admin.css';

export default function AdminLogin() {
  const status = useAdminAuthStore((state) => state.status);
  const setStaff = useAdminAuthStore((state) => state.setStaff);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (status === 'authenticated') return <Navigate to="/admin" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await loginRequest(email, password);
      setStaff(result.staff);
      navigate('/admin', { replace: true });
    } catch {
      setError('Неверный e-mail или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__logo">
          Lumi&egrave;re
          <span>Вход для персонала</span>
        </div>

        {error && <p className="admin-error-banner">{error}</p>}

        <div className="admin-form__field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="admin-form__field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="btn--full" disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </Button>
      </form>
    </div>
  );
}
