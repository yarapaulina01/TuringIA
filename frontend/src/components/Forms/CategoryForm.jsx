import { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  description: ''
};

function CategoryForm({
  category,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name ?? '',
        description: category.description ?? '',
      });
    } else {
      setForm(initialForm);
    }

    setError('');
  }, [category]);

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
        ...form
      });
    } catch (err) {
      setError(err.message || 'No se pudo guardar la categoría.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="category-form-panel">
      <h2>{category ? 'Editar categoría' : 'Nueva categoría'}</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <label htmlFor="category-name">Nombre</label>
        <input
          id="category-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={255}
        />

        <label htmlFor="category-description">Descripción</label>
        <textarea
          id="category-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <div className="category-form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? 'Guardando...'
              : category
                ? 'Guardar cambios'
                : 'Crear categoría'}
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

export default CategoryForm;
