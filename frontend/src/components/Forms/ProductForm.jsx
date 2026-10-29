import { useEffect, useState } from 'react';

const initialForm = {
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
};

function ProductForm({
    categories,
    product,
    onSave,
    onCancel,
}) {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                category_id: String(product.category_id ?? ''),
                name: product.name ?? '',
                description: product.description ?? '',
                price: String(product.price ?? ''),
                stock: String(product.stock ?? ''),
                image_url: product.image_url ?? '',
            });
        } else {
            setForm(initialForm);
        }

        setError('');
    }, [product]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSave({
                ...form,
                category_id: Number(form.category_id),
                price: Number(form.price),
                stock: Number(form.stock),
            });
        } catch (err) {
            setError(err.message || 'No se pudo guardar el producto.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="product-form-panel">
            <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>

            <form onSubmit={handleSubmit} className="product-form">
                <label htmlFor="product-name">Nombre</label>
                <input
                    id="product-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />

                <label htmlFor="product-category">Categoría</label>
                <select
                    id="product-category"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="product-description">Descripción</label>
                <textarea
                    id="product-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                />

                <label htmlFor="product-price">Precio</label>
                <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="product-stock">Stock</label>
                <input
                    id="product-stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="product-image">URL de la imagen</label>
                <input
                    id="product-image"
                    name="image_url"
                    type="url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />

                {error && (
                    <p className="login-error" role="alert">
                        {error}
                    </p>
                )}

                <div className="product-form-actions">
                    <button type="submit" disabled={saving}>
                        {saving
                            ? 'Guardando...'
                            : product
                                ? 'Guardar cambios'
                                : 'Crear producto'}
                    </button>

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ProductForm;
