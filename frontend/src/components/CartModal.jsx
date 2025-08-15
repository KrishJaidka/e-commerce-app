import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    alert('Checkout functionality will be implemented soon!');
  };

  if (!isOpen) return null;

  return (
    <div className="qc-cart-modal-overlay" onClick={onClose}>
      <div className="qc-cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qc-cart-header">
          <div className="qc-cart-title">
            <ShoppingCart size={24} />
            <h2>Shopping Cart ({getTotalItems()} items)</h2>
          </div>
          <button className="qc-cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="qc-cart-content">
          {cartItems.length === 0 ? (
            <div className="qc-cart-empty">
              <ShoppingCart size={64} />
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <button className="qc-btn qc-btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="qc-cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="qc-cart-item">
                    <div className="qc-cart-item-image">
                      {item.productImage ? (
                        <img 
                          src={item.productImage} 
                          alt={item.title}
                          onError={(e) => {
                            e.target.src = '/vite.svg';
                          }}
                        />
                      ) : (
                        <div className="qc-cart-no-image">No Image</div>
                      )}
                    </div>
                    
                    <div className="qc-cart-item-details">
                      <h3 className="qc-cart-item-title">{item.title}</h3>
                      <div className="qc-cart-item-price">
                        {formatPrice(item.price)}
                      </div>
                      {item.category && (
                        <span className="qc-cart-item-category">{item.category}</span>
                      )}
                      {item.seller && (
                        <div className="qc-cart-item-seller">
                          by {item.seller.brandName || item.seller.username}
                        </div>
                      )}
                    </div>

                    <div className="qc-cart-item-controls">
                      <div className="qc-quantity-controls">
                        <button 
                          className="qc-quantity-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qc-quantity-value">{item.quantity}</span>
                        <button 
                          className="qc-quantity-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="qc-cart-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      
                      <button 
                        className="qc-remove-btn"
                        onClick={() => removeFromCart(item._id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="qc-cart-footer">
                <div className="qc-cart-summary">
                  <div className="qc-cart-total">
                    <strong>Total: {formatPrice(getTotalPrice())}</strong>
                  </div>
                  <div className="qc-cart-actions">
                    <button 
                      className="qc-btn qc-btn-secondary"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                    <button 
                      className="qc-btn qc-btn-primary"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
