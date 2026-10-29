import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { getProducts, createProduct, updateProduct, deleteProduct, } from '../services/productService';
import { logout } from '../services/authService';
import ProductCard from '../components/ProductCard';
import '../App.css';

function AdminPage() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/login', { replace: true });
            return;
        }

        loadData();
    }, []);

    async function loadData() {
        try {
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories(),
            ]);

            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function openCreateForm() {
        setEditingProduct(null);
        setMessage('');
        setError('');
        setShowForm(true);
    }

    function openEditForm(product) {
        setEditingProduct(product);
        setMessage('');
        setError('');
        setShowForm(true);
    }

    async function handleSaveProduct(productData) {
        setMessage('');
        setError('');

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                setMessage('Producto actualizado correctamente.');
            } else {
                await createProduct(productData);
                setMessage('Producto creado correctamente.');
            }

            await loadData();
            setShowForm(false);
            setEditingProduct(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function handleDeleteProduct(product) {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteProduct(product.id);
            setMessage('Producto eliminado correctamente.');
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleLogout() {
        await logout();
        navigate('/', { replace: true });
    }

    if (user?.role !== 'admin') {
        return null;
    }

    return (
        <main className="store">
            <header className="store-header">
                <Link to="/" className="brand">
                    TecnoShop <span>Pro</span>
                </Link>

                <div className="header-actions">
                    <span className="user-label">
                        Hola, {user.name}
                    </span>

                    <Link to="/">Volver a la tienda</Link>

                    <button type="button" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <section className="catalog" id="catalogo">
                <div className="section-heading">
                    <p className="eyebrow">GESTIÓN DE LA TIENDA</p>
                    <h2>Panel de administración</h2>
                    <p className="section-description">
                        Administra los productos de TecnoShop Pro.
                    </p>
                </div>

                <div className="admin-toolbar">
                    <div>
                        <strong>Productos registrados</strong>
                        <p>Consulta, registra, edita o elimina productos.</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/admin/products/create')}
                    >
                        + Nuevo producto
                    </button>
                </div>

                {message && (
                    <p className="crud-message" role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="crud-error" role="alert">
                        {error}
                    </p>
                )}


                {loading ? (
                    <p className="status-message">
                        Cargando productos...
                    </p>
                ) : products.length === 0 ? (
                    <p className="status-message">
                        No hay productos registrados.
                    </p>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div className="product-wrapper" key={product.id}>
                                <ProductCard product={product} />

                                <div className="product-admin-actions">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => handleDeleteProduct(product)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminPage;
