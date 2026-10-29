const API_URL = 'http://127.0.0.1:8000/api';

export const getExternalProducts = async () => {
    const response = await fetch(`${API_URL}/external-products`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener los productos externos');
    }

    const result = await response.json();

    return result.data;
};