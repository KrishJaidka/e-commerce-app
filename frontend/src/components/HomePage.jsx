import React, { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingCart, Heart, Moon, Sun } from 'lucide-react';
import AuthModal from './SignupModal';
import ProductGrid from './ProductGrid';
import ProfileAvatar from './ProfileAvatar';
import FavoritesModal from './FavoritesModal';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import './HomePage.css';

const HomePage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [currentSection, setCurrentSection] = useState('home'); // 'home' or 'explore'
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { addToCart, getCartItemsCount } = useCart();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Fetch products with initial pagination (only for explore section)
  const {
    products,
    loading,
    loadingMore,
    error,
    pagination,
    loadMore,
    searchProducts,
    filterProducts
  } = useProducts({ 
    page: 1, 
    limit: 12,
    sortBy: 'createdAt',
    order: 'desc'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [favorites, setFavorites] = useState(new Set()); // Track favorite items
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchProducts(searchTerm, { 
        category: selectedCategory !== 'all' ? selectedCategory : undefined 
      });
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    await filterProducts({
      category: category !== 'all' ? category : undefined,
      page: 1,
      limit: 12
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentSection('explore');
    handleCategoryFilter(category);
  };

  // Category data - Updated with Etsy-inspired categories
  const categories = [
    { name: 'accessories', title: 'Accessories', description: 'Stylish accessories for any occasion' },
    { name: 'art-and-collectibles', icon: '🎨', title: 'Art & Collectibles', description: 'Unique art and collectible items' },
    { name: 'baby', icon: '👶', title: 'Baby', description: 'Everything for your little one' },
    { name: 'bags-and-purses', icon: '👛', title: 'Bags & Purses', description: 'Fashionable bags and purses' },
    { name: 'bath-and-beauty', icon: '�', title: 'Bath & Beauty', description: 'Skincare and beauty essentials' },
    { name: 'books-films-music', icon: '📚', title: 'Books, Films & Music', description: 'Entertainment and media' },
    { name: 'clothing', icon: '👗', title: 'Clothing', description: 'Fashion and apparel' },
    { name: 'craft-supplies-tools', icon: '✂️', title: 'Craft Supplies & Tools', description: 'DIY and crafting materials' },
    { name: 'electronics-accessories', icon: '�', title: 'Electronics & Accessories', description: 'Latest gadgets and tech' },
    { name: 'gifts', icon: '🎁', title: 'Gifts', description: 'Perfect presents for everyone' },
    { name: 'home-living', icon: '🏠', title: 'Home & Living', description: 'Furniture and home decor' },
    { name: 'jewellery', icon: '💍', title: 'Jewellery', description: 'Beautiful jewelry pieces' },
    { name: 'paper-party-supplies', icon: '🎉', title: 'Paper & Party Supplies', description: 'Party and paper goods' },
    { name: 'pet-supplies', icon: '�', title: 'Pet Supplies', description: 'Everything for your pets' },
    { name: 'shoes', icon: '👟', title: 'Shoes', description: 'Footwear for every style' },
    { name: 'toys-games', icon: '🧸', title: 'Toys & Games', description: 'Fun toys and games' },
    { name: 'weddings', icon: '💒', title: 'Weddings', description: 'Wedding essentials and decor' }
  ];

  // Favorite functionality
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (productId) => {
    return favorites.has(productId);
  };

  // Featured categories for the main grid (top 6)
  const featuredCategories = categories.slice(0, 6);

  const stats = [
    { number: '1M+', label: 'Happy Customers' },
    { number: '500K+', label: 'Orders Shipped' },
    { number: '10K+', label: 'Partner Brands' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Amazing quality products and fast delivery! I love shopping here.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      text: 'Great variety and excellent customer service. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      text: 'Best online shopping experience I\'ve had. Will definitely shop again.',
      rating: 5
    }
  ];

  return (
    <div className="qc-home">
      <header className="qc-header">
        <div className="qc-header-left">
          <button 
            className="qc-logo" 
            onClick={() => setCurrentSection('home')}
          >
            <img src="/quick-cart-logo-transparent.png" alt="QuickCart" className="qc-logo-image" />
            <span className="qc-brand-name">QuickCart</span>
          </button>
          <div className="qc-categories-hamburger" ref={dropdownRef}>
            <button 
              className="qc-hamburger-btn"
              onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
            >
              <Menu size={20} />
              <span className="qc-categories-text">Categories</span>
            </button>
            {showCategoriesDropdown && (
              <div className="qc-categories-dropdown-menu">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="qc-category-dropdown-item"
                    onClick={() => {
                      handleCategoryClick(category.name);
                      setShowCategoriesDropdown(false);
                    }}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="qc-header-right">
          <nav className="qc-nav">
            <button 
              className={`qc-nav-btn ${currentSection === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentSection('home')}
            >
              Home
            </button>
            <button 
              className={`qc-nav-btn ${currentSection === 'explore' ? 'active' : ''}`}
              onClick={() => setCurrentSection('explore')}
            >
              Explore
            </button>
            <button 
              className="qc-nav-link qc-favorites-btn"
              onClick={() => setShowFavoritesModal(true)}
            >
              <Heart size={20} />
              {favorites.size > 0 && (
                <span className="qc-favorites-count">{favorites.size}</span>
              )}
            </button>
            <button className="qc-nav-link qc-cart-btn">
              <ShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <span className="qc-cart-count">{getCartItemsCount()}</span>
              )}
            </button>
            <button 
              className="qc-nav-link qc-darkmode-btn"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
          
          <div className="qc-user-section">
            {authLoading ? (
              <div style={{ padding: '8px 16px', color: '#666' }}>Loading...</div>
            ) : isAuthenticated ? (
              <ProfileAvatar user={user} onLogout={logout} />
            ) : (
              <button className="qc-signup-btn" onClick={() => setShowAuth(true)}>
                Sign up
              </button>
            )}
          </div>
        </div>
      </header>
      
      {currentSection === 'home' ? (
        // HOME SECTION
        <>
          <section className="qc-hero">
            <h1>Discover unique handmade & vintage goods</h1>
            <p>Shop millions of one-of-a-kind items from creative sellers around the world.</p>
            {!isAuthenticated && (
              <button className="qc-cta" onClick={() => setShowAuth(true)}>
                Get Started
              </button>
            )}
          </section>

          {/* Categories Section */}
          <section className="qc-categories">
            <div className="qc-section-header">
              <h2>Shop by Category</h2>
              <p>Explore our diverse range of products</p>
            </div>
            <div className="qc-category-grid">
              {featuredCategories.map((category) => (
                <div 
                  key={category.name}
                  className="qc-category-card"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="qc-stats">
            <div className="qc-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="qc-stat-card">
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="qc-testimonials">
            <div className="qc-section-header">
              <h2>What Our Customers Say</h2>
              <p>Don't just take our word for it</p>
            </div>
            <div className="qc-testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="qc-testimonial-card">
                  <div className="qc-testimonial-stars">
                    {'★'.repeat(testimonial.rating)}
                  </div>
                  <p>"{testimonial.text}"</p>
                  <h4>- {testimonial.name}</h4>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        // EXPLORE SECTION
        <>
          <section className="qc-explore-header">
            <h1>Explore Products</h1>
            <p>Discover amazing products from our sellers</p>
          </section>

          {/* Search and Filter Section */}
          <section className="qc-search-section">
            <div className="qc-search-container">
              <form onSubmit={handleSearch} className="qc-search-form">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="qc-search-input"
                />
                <button type="submit" className="qc-search-btn">
                  Search
                </button>
              </form>
              
              <div className="qc-category-filters">
                {['all', 'electronics', 'home', 'beauty', 'grocery', 'lighting'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`qc-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </section>
          
          <section className="qc-featured">
            <div className="qc-featured-title">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Products'}
            </div>
            
            <ProductGrid
              products={products}
              loading={loading}
              loadingMore={loadingMore}
              error={error}
              pagination={pagination}
              onLoadMore={loadMore}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              onAddToCart={addToCart}
            />
          </section>
        </>
      )}
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        onRemoveFavorite={toggleFavorite}
        onAddToCart={addToCart}
        products={products}
      />
    </div>
  );
};

export default HomePage;
