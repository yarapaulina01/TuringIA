
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

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

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === 'all' ||
            String(product.category_id) === String(selectedCategory);

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });
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
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin">Panel administrador</Link>
                            )}

                            <span>Hola, {user.name}</span>

                            <button type="button" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Iniciar sesión</Link>
                    )}
                </div>
            </header>

            <section className="hero" id="inicio">
                <div className="hero-main">
                    <div className="hero-content">
                        <p className="eyebrow hero-eyebrow">
                            TECNOLOGÍA PARA TU DÍA A DÍA
                        </p>

                        <h1>
                            Tecnología que
                            <br />
                            <span>conecta contigo.</span>
                        </h1>

                        <p className="hero-description">
                            Descubre dispositivos y accesorios diseñados para
                            acompañarte en cada proyecto, idea y aventura.
                        </p>

                        <a href="#catalogo" className="hero-button">
                            Explorar catálogo <span>→</span>
                        </a>

                        <div className="hero-indicators" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>

                    <div className="hero-products" aria-label="Productos destacados">
                        {products.slice(0, 3).map((product, index) => (
                            <div
                                className={`hero-product hero-product-${index + 1}`}
                                key={product.id}
                            >
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                />
                                <span>{product.name}</span>
                            </div>
                        ))}
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

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleProducts(8);
                        }}
                        aria-label="Buscar productos por nombre o descripción"
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setVisibleProducts(8);
                            }}
                        >
                            Limpiar
                        </button>
                    )}
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

            <section className="promo-section">
                <div className="section-heading">
                    <p className="eyebrow">DESCUBRE MÁS</p>
                    <h2>Explora nuestro universo tecnológico</h2>
                    <p>Encuentra lo que necesitas para conectar, crear y disfrutar.</p>
                </div>

                <div className="promo-grid">
                    <a href="#catalogo" className="promo-card promo-card-large">
                        <img
                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900"
                            alt="Audífonos inalámbricos"
                            loading="lazy"
                        />
                        <div className="promo-overlay">
                            <span>SONIDO Y ENTRETENIMIENTO</span>
                            <h3>Sumérgete en tu música.</h3>
                            <p>Descubre accesorios para disfrutar cada momento.</p>
                            <span className="promo-link">Explorar productos ↗</span>
                        </div>
                    </a>

                    <a href="#catalogo" className="promo-card">
                        <img
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
                            alt="Reloj inteligente"
                            loading="lazy"
                        />
                        <div className="promo-overlay">
                            <span>TECNOLOGÍA INTELIGENTE</span>
                            <h3>Conecta con tu día.</h3>
                            <span className="promo-link">Descubrir ↗</span>
                        </div>
                    </a>

                    <a href="#catalogo" className="promo-card">
                        <img
                            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700"
                            alt="Dispositivos electrónicos"
                            loading="lazy"
                        />
                        <div className="promo-overlay">
                            <span>INNOVACIÓN</span>
                            <h3>Todo comienza aquí.</h3>
                            <span className="promo-link">Ver catálogo ↗</span>
                        </div>
                    </a>

                    <a href="#catalogo" className="promo-card promo-card-wide">
                        <img
                            src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900"
                            alt="Pantalla de entretenimiento"
                            loading="lazy"
                        />
                        <div className="promo-overlay">
                            <span>EXPERIENCIAS DIGITALES</span>
                            <h3>Haz espacio para lo extraordinario.</h3>
                            <span className="promo-link">Explorar ↗</span>
                        </div>
                    </a>
                </div>
            </section>

            <section className="benefits" id="beneficios">
                <div className="benefits-heading">
                    <p className="eyebrow">¿POR QUÉ TECNOSHOP PRO?</p>
                    <h2>Tu experiencia, nuestra prioridad.</h2>
                    <p>Queremos que disfrutes la tecnología con una experiencia sencilla y confiable.</p>
                </div>

                <div className="benefits-grid">
                    <article className="benefit-card">
                        <div className="benefit-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7h11v11H3z" />
                                <path d="M14 11h4l3 3v4h-7z" />
                                <circle cx="7.5" cy="18" r="2" />
                                <circle cx="17.5" cy="18" r="2" />
                            </svg>
                        </div>
                        <h3>Envíos seguros</h3>
                        <p>Recibe tus productos de manera cómoda y segura.</p>
                        <span className="benefit-decoration">01</span>
                    </article>

                    <article className="benefit-card">
                        <div className="benefit-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                        <h3>Compra confiable</h3>
                        <p>Encuentra productos seleccionados para acompañarte en tu día a día.</p>
                        <span className="benefit-decoration">02</span>
                    </article>

                    <article className="benefit-card">
                        <div className="benefit-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
                            </svg>
                        </div>
                        <h3>Atención cercana</h3>
                        <p>Estamos aquí para ayudarte a encontrar lo que necesitas.</p>
                        <span className="benefit-decoration">03</span>
                    </article>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-main">
                    <div className="footer-brand">
                        <a href="#inicio" className="brand">
                            TecnoShop <span>Pro</span>
                        </a>

                        <p>
                            Tecnología que conecta contigo.
                            Descubre productos y accesorios para tu día a día.
                        </p>

                        <div className="footer-social">
                            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
                            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
                            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">tk</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>Explora</h3>
                        <a href="#inicio">Inicio</a>
                        <a href="#catalogo">Catálogo</a>
                        <a href="#beneficios">Beneficios</a>
                    </div>

                    <div className="footer-column">
                        <h3>Mi cuenta</h3>
                        <a href="/login">Iniciar sesión</a>
                        <a href="#catalogo">Ver productos</a>
                    </div>

                    <div className="footer-column footer-contact">
                        <h3>¿Necesitas ayuda?</h3>
                        <p>Estamos aquí para ayudarte a encontrar lo que buscas.</p>
                        <a href="mailto:contacto@tecnoshoppro.com">
                            contacto@tecnoshoppro.com
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} TecnoShop Pro. Todos los derechos reservados.</p>
                    <span>Diseñado para conectar contigo. <span className="footer-heart">♥</span></span>
                </div>
            </footer>
        </main>
    );
}

export default Home;
