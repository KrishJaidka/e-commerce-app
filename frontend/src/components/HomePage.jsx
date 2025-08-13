import React, { useState } from 'react';
import SignupModal from './SignupModal';
import './HomePage.css';

const HomePage = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="qc-home">
      <header className="qc-header">
        <div className="qc-logo">QuickCart</div>
        <nav className="qc-nav">
          <a href="#">Home</a>
          <a href="#">Shop</a>
          <a href="#">Categories</a>
          <a href="#">Cart</a>
          <button className="qc-signup-btn" onClick={() => setShowSignup(true)}>
            Sign up
          </button>
        </nav>
      </header>
      <section className="qc-hero">
        <h1>Discover unique handmade & vintage goods</h1>
        <p>Shop millions of one-of-a-kind items from creative sellers around the world.</p>
        <button className="qc-cta" onClick={() => setShowSignup(true)}>
          Get Started
        </button>
      </section>
      <section className="qc-featured">
        {/* Placeholder for featured products grid */}
        <div className="qc-featured-title">Featured Products</div>
        <div className="qc-product-grid">
          {/* Product cards will go here */}
        </div>
      </section>
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
};

export default HomePage;
