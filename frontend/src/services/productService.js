const API_URL = 'http://127.0.0.1:8000/api';

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationErrors = result.errors
      ? Object.values(result.errors).flat().join('\n')
      : '';

    throw new Error(
      validationErrors ||
      result.message ||
      'Ocurrió un error al comunicarse con el servidor.'
    );
  }

  return result;
}

export async function getProducts() {
  const result = await apiRequest(`${API_URL}/products`);
  return result.data;
}

export async function createProduct(product) {
  return apiRequest(`${API_URL}/products`, {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return apiRequest(`${API_URL}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return apiRequest(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
}
