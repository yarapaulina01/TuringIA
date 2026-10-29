
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            Sin imagen disponible
          </div>
        )}
      </div>

      <div className="product-info">
        <p className="product-category">
          {product.category?.name ?? 'Tecnología'}
        </p>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description || 'Descubre este producto en TecnoShop.'}
        </p>

        <div className="product-footer">
          <span className="product-price">
            ${Number(product.price).toLocaleString('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          <span className="product-stock">
            {product.stock > 0 ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
