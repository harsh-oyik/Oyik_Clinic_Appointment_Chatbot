import React, { useState } from 'react';
import { Bot, Calendar, Phone, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenChat }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#" className="nav-brand">
          <div className="brand-emblem">
            <img src="/assets/logo.png" alt="Oyik Clinic Logo" className="brand-logo-img" />
          </div>
          <div className="brand-text">
            <span className="brand-title">OYIK CLINIC</span>
            <span className="brand-subtitle">HERITAGE CARE & WELLNESS</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <a href="#specialties" className="nav-link">Specialties</a>
          <a href="#heritage-care" className="nav-link">Heritage Healing</a>
          <a href="#doctors" className="nav-link">Specialists</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#reviews" className="nav-link">Reviews</a>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <a href="tel:+18005556945" className="nav-phone-link" aria-label="Call reception">
            <Phone size={14} className="text-gold" />
            <span className="nav-phone-text">(800) 555-OYIK</span>
          </a>

          {/* Book Appointment CTA */}
          <button 
            type="button"
            className="btn btn-gold btn-sm nav-cta animate-pulse-glow"
            onClick={() => onOpenChat()}
          >
            <Bot size={17} />
            <span className="nav-cta-text-desktop">Book Appointment</span>
            <span className="nav-cta-text-mobile">Book</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true" 
          />
          <div className="mobile-menu-drawer animate-slide-down">
            <a href="#specialties" onClick={() => setMobileMenuOpen(false)}>Specialties</a>
            <a href="#heritage-care" onClick={() => setMobileMenuOpen(false)}>Heritage Healing</a>
            <a href="#doctors" onClick={() => setMobileMenuOpen(false)}>Specialists</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <div className="mobile-drawer-actions">
              <a 
                href="tel:+18005556945"
                className="btn btn-outline btn-sm btn-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone size={15} /> Reception: (800) 555-OYIK
              </a>
              <button 
                type="button"
                className="btn btn-gold btn-sm btn-full"
                onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
              >
                <Bot size={16} /> Book via Oyik AI
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
