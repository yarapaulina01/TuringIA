const API_URL = 'http://127.0.0.1:8000/api';

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las categorías');
  }

  const result = await response.json();

  return result.data;
}
