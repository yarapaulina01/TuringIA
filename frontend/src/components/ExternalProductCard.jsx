import './styles/ExternalProductCard.css';

function ExternalProductCard({ product }) {
    return (
        <article className="external-product-card">
            <img
                src={product.image}
                alt={product.title}
            />

            <div className="external-product-info">
                <span className="external-product-category">
                    {product.category}
                </span>

                <h3>{product.title}</h3>

                <p>{product.description}</p>

                <div className="external-product-rating">
                    ⭐ {product.rating?.rate} ({product.rating?.count} opiniones)
                </div>

                <strong>${Number(product.price).toFixed(2)}</strong>

                <span className={product.inStock ? 'in-stock' : 'out-stock'}>
                    {product.inStock ? 'Disponible' : 'Agotado'}
                </span>
            </div>
        </article>
    );
}

export default ExternalProductCard;