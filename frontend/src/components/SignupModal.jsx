import React from 'react';
import './SignupModal.css';

const SignupModal = ({ onClose }) => {
  return (
    <div className="qc-modal-backdrop" onClick={onClose}>
      <div className="qc-modal" onClick={e => e.stopPropagation()}>
        <button className="qc-modal-close" onClick={onClose}>&times;</button>
        <h2>Sign up for QuickCart</h2>
        <form className="qc-signup-form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="Password" required />
          </label>
          <button type="submit" className="qc-modal-submit">Sign Up</button>
        </form>
        <div className="qc-modal-footer">
          Already have an account? <a href="#">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
