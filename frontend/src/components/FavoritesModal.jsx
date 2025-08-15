import React from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import './FavoritesModal.css';

const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  favorites, 
  onRemoveFavorite, 
  onAddToCart,
  products 
}) => {
  if (!isOpen) return null;

  // Get favorite products from the products array
  const favoriteProducts = products.filter(product => favorites.has(product._id));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="qc-favorites-modal-overlay" onClick={onClose}>
      <div className="qc-favorites-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qc-favorites-header">
          <h2>Your Favorites</h2>
          <button className="qc-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="qc-favorites-content">
          {favoriteProducts.length === 0 ? (
            <div className="qc-empty-favorites">
              <Heart size={48} />
              <h3>No favorites yet</h3>
              <p>Start adding items to your favorites to see them here!</p>
            </div>
          ) : (
            <div className="qc-favorites-grid">
              {favoriteProducts.map((product) => (
                <div key={product._id} className="qc-favorite-item">
                  <div className="qc-favorite-image">
                    {product.productImage ? (
                      <img 
                        src={product.productImage} 
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = '/vite.svg';
                        }}
                      />
                    ) : (
                      <div className="qc-no-image">No Image</div>
                    )}
                  </div>
                  
                  <div className="qc-favorite-info">
                    <h3 className="qc-favorite-title">{product.title}</h3>
                    <div className="qc-favorite-price">{formatPrice(product.price)}</div>
                    {product.category && (
                      <span className="qc-favorite-category">{product.category}</span>
                    )}
                  </div>

                  <div className="qc-favorite-actions">
                    <button 
                      className="qc-btn qc-btn-primary"
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <button 
                      className="qc-btn qc-btn-remove"
                      onClick={() => onRemoveFavorite(product._id)}
                    >
                      <Heart size={16} fill="currentColor" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
