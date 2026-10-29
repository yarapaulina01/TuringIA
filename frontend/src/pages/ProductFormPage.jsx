import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { getProducts, createProduct, updateProduct } from '../services/productService';
import ProductForm from '../components/Forms/ProductForm';
import { logout } from '../services/authService';

import '../App.css';

function ProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });

    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadData() {
            if (user?.role !== 'admin') {
                navigate('/login', { replace: true });
                return;
            }

            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);

                if (id) {
                    const productsData = await getProducts();
                    const foundProduct = productsData.find(
                        (item) => String(item.id) === String(id)
                    );

                    if (!foundProduct) {
                        setError('No se encontró el producto.');
                        return;
                    }

                    setProduct(foundProduct);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, user, navigate]);

    async function handleSaveProduct(productData) {
        if (id) {
            await updateProduct(id, productData);
        } else {
            await createProduct(productData);
        }

        navigate('/admin');
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
                    <Link to="/admin">Volver al panel</Link>
                    <button type="button" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <section className="catalog">
                <div className="section-heading">
                    <p className="eyebrow">GESTIÓN DE PRODUCTOS</p>
                    <h2>{id ? 'Editar producto' : 'Registrar producto'}</h2>
                    <p className="section-description">
                        {id
                            ? 'Modifica la información del producto.'
                            : 'Completa los datos para agregar un nuevo producto.'}
                    </p>
                </div>

                {loading ? (
                    <p className="status-message">Cargando información...</p>
                ) : error ? (
                    <p className="crud-error">{error}</p>
                ) : (
                    <ProductForm
                        categories={categories}
                        product={product}
                        onSave={handleSaveProduct}
                        onCancel={() => navigate('/admin')}
                    />
                )}
            </section>
        </main>
    );
}

export default ProductFormPage;
