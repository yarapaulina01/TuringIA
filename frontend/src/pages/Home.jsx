
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { getExternalProducts } from '../services/externalProductService';
import ExternalProductCard from '../components/ExternalProductCard';
import '../App.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [externalProducts, setExternalProducts] = useState([]);
    const [externalLoading, setExternalLoading] = useState(false);
    const [externalError, setExternalError] = useState('');
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [visibleExternalProducts, setVisibleExternalProducts] = useState(8);

    useEffect(() => {
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

        loadData();
    }, []);

    useEffect(() => {
        async function loadExternalProducts() {
            try {
                setExternalLoading(true);
                const data = await getExternalProducts();
                setExternalProducts(data);
            } catch (err) {
                setExternalError(err.message);
            } finally {
                setExternalLoading(false);
            }
        }

        loadExternalProducts();
    }, []);

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter(
                (product) =>
                    String(product.category_id) === String(selectedCategory)
            );
    const displayedProducts = filteredProducts.slice(0, visibleProducts);
    const displayedExternalProducts = externalProducts.slice(0, visibleExternalProducts);


    const handleReloadExternalProducts = async () => {
        try {
            setExternalLoading(true);
            setExternalError('');

            const data = await getExternalProducts();
            setExternalProducts(data);
        } catch (err) {
            setExternalError(err.message);
        } finally {
            setExternalLoading(false);
        }
    };

    return (
        <main className="store">
            <header className="store-header">
                <a href="#inicio" className="brand">
                    TecnoShop <span>Pro</span>
                </a>

                <nav className="main-nav" aria-label="Navegación principal">
                    <a href="#inicio">Inicio</a>
                    <a href="#catalogo">Catálogo</a>
                    <a href="#beneficios">Beneficios</a>
                </nav>

                <div className="header-actions">
                    <Link to="/login">Acceso administrador</Link>
                </div>
            </header>

            <section className="hero" id="inicio">
                <div className="hero-content">
                    <p className="eyebrow hero-eyebrow">
                        TECNOLOGÍA PARA TU DÍA A DÍA
                    </p>

                    <h1>
                        Tecnología que
                        <br />
                        conecta contigo.
                    </h1>

                    <p className="hero-description">
                        Descubre dispositivos y accesorios diseñados para
                        acompañarte en cada proyecto, idea y aventura.
                    </p>

                    <a href="#catalogo" className="hero-button">
                        Explorar catálogo
                    </a>

                    <div className="hero-decoration" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>

                <div className="hero-features" aria-label="Nuestros productos">
                    <a href="#catalogo" className="hero-feature">
                        <span className="feature-symbol">01</span>
                        <span>Dispositivos</span>
                    </a>

                    <a href="#catalogo" className="hero-feature">
                        <span className="feature-symbol">02</span>
                        <span>Accesorios</span>
                    </a>

                    <a href="#catalogo" className="hero-feature">
                        <span className="feature-symbol">03</span>
                        <span>Innovación</span>
                    </a>
                </div>
            </section>

            <section className="catalog" id="catalogo">
                <div className="section-heading">
                    <p className="eyebrow">DESCUBRE NUESTRA SELECCIÓN</p>
                    <h2>Encuentra tu próxima tecnología</h2>
                    <p className="section-description">
                        Explora nuestro catálogo y encuentra lo que necesitas.
                    </p>
                </div>

                <nav className="category-filters" aria-label="Filtrar productos">
                    <button
                        type="button"
                        className={selectedCategory === 'all' ? 'active' : ''}
                        onClick={() => {
                            setSelectedCategory('all');
                            setVisibleProducts(8);
                        }}
                    >
                        Todos
                    </button>

                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category.id}
                            className={
                                String(selectedCategory) === String(category.id)
                                    ? 'active'
                                    : ''
                            }
                            onClick={() => {
                                setSelectedCategory(String(category.id));
                                setVisibleProducts(8);
                            }}
                        >
                            {category.name}
                        </button>
                    ))}
                </nav>

                <div className="catalog-results">
                    <span>
                        {filteredProducts.length}{' '}
                        {filteredProducts.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>

                {loading ? (
                    <p className="status-message">Cargando catálogo...</p>
                ) : error ? (
                    <p className="status-message error">{error}</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="status-message">
                        No hay productos en esta categoría todavía.
                    </p>
                ) : (
                    <div className="product-grid">
                        {displayedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="catalog external-catalog">
                <h2>Productos tecnológicos destacados</h2>
                <p>Productos obtenidos desde nuestra API externa.</p>

                <button
                    type="button"
                    onClick={handleReloadExternalProducts}
                    disabled={externalLoading}
                >
                    {externalLoading ? 'Actualizando...' : 'Actualizar productos'}
                </button>

                {externalLoading && <p>Cargando productos...</p>}
                {externalError && <p>{externalError}</p>}

                <div className="product-grid">
                    {displayedExternalProducts.map((product) => (
                        <ExternalProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
                {visibleProducts < filteredProducts.length && (
                    <div className="load-more-container">
                        <button
                            type="button"
                            onClick={() => setVisibleProducts((prev) => prev + 8)}
                        >
                            Cargar más productos
                        </button>
                    </div>
                )}
                {visibleExternalProducts < externalProducts.length && (
                    <div className="load-more-container">
                        <button
                            type="button"
                            onClick={() =>
                                setVisibleExternalProducts((prev) => prev + 8)
                            }
                        >
                            Cargar más productos
                        </button>
                    </div>
                )}
            </section>

            <section className="promo-section" aria-label="Explora la tecnología">
                <div className="promo-heading">
                    <p className="eyebrow">UN MUNDO DE POSIBILIDADES</p>
                    <h2>Encuentra lo que impulsa tus ideas.</h2>
                </div>

                <div className="promo-grid">
                    <a href="#catalogo" className="promo-block promo-block-solid">
                        <span>01 / Explora</span>
                        <strong>Descubre productos</strong>
                    </a>

                    <a href="#catalogo" className="promo-block promo-block-solid">
                        <span>02 / Elige</span>
                        <strong>Encuentra tu favorito</strong>
                    </a>

                    <a href="#catalogo" className="promo-block promo-block-pattern">
                        <span>03 / Conecta</span>
                        <strong>Hazlo posible</strong>
                    </a>

                    <a href="#beneficios" className="promo-block promo-block-pattern">
                        <span>04 / Avanza</span>
                        <strong>Da el siguiente paso</strong>
                    </a>
                </div>
            </section>

            <section className="benefits-section" id="beneficios">
                <div className="section-heading">
                    <p className="eyebrow">TU EXPERIENCIA ES IMPORTANTE</p>
                    <h2>Una tienda pensada para ti</h2>
                </div>

                <div className="benefits-grid">
                    <article className="benefit-item">
                        <div className="benefit-circle">
                            <span>01</span>
                        </div>
                        <h3>Variedad</h3>
                        <p>
                            Explora distintas opciones tecnológicas en un solo lugar.
                        </p>
                    </article>

                    <article className="benefit-item">
                        <div className="benefit-circle benefit-circle-large">
                            <span>02</span>
                        </div>
                        <h3>Practicidad</h3>
                        <p>
                            Encuentra y consulta productos de forma sencilla.
                        </p>
                    </article>

                    <article className="benefit-item">
                        <div className="benefit-circle">
                            <span>03</span>
                        </div>
                        <h3>Innovación</h3>
                        <p>
                            Descubre herramientas que acompañan tus ideas.
                        </p>
                    </article>
                </div>
            </section>

            <footer className="store-footer">
                <a href="#inicio" className="brand footer-brand">
                    TecnoShop <span>Pro</span>
                </a>

                <p>Tecnología para todos.</p>

                <nav aria-label="Enlaces del pie de página">
                    <a href="#inicio">Inicio</a>
                    <a href="#catalogo">Catálogo</a>
                    <a href="#beneficios">Beneficios</a>
                </nav>

                <small>© {new Date().getFullYear()} TecnoShop Pro</small>
            </footer>
        </main>
    );
}

export default Home;
