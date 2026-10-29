
const API_URL = 'http://127.0.0.1:8000/api';

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || 'No se pudo iniciar sesión.'
    );
  }

  if (!result.token || !result.user) {
    throw new Error('La respuesta del servidor está incompleta.');
  }

  localStorage.setItem('token', result.token);
  localStorage.setItem('user', JSON.stringify(result.user));

  return result.user;
}

export async function logout() {
  const token = localStorage.getItem('token');

  try {
    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
