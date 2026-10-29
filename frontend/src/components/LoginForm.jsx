
import { useState } from 'react';
import { login } from '../services/authService';

function LoginForm({ onLogin, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role !== 'admin') {
        setError(
          'Tu cuenta no tiene permisos de administrador.'
        );
        return;
      }

      onLogin(user);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-panel">
      <h2>Acceso de administrador</h2>
      <p>Inicia sesión para administrar los productos.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@ejemplo.com"
          autoComplete="username"
          required
        />

        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        <button
          type="button"
          className="login-cancel"
          onClick={onCancel}
        >
          Volver al catálogo
        </button>
      </form>
    </section>
  );
}

export default LoginForm;
