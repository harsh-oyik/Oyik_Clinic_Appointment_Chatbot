import React, { useState } from 'react';
import { Sparkles, Bot, Settings, Calendar, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenChat, onOpenN8nConfig, n8nWebhookUrl, isN8nActive }) {
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
          {/* n8n Status / Config Button */}
          <button 
            type="button"
            className={`n8n-status-pill ${isN8nActive ? 'active' : 'demo'}`}
            onClick={onOpenN8nConfig}
            title="Configure or test your n8n chatbot webhook"
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {isN8nActive ? 'n8n Connected' : 'n8n: Demo Mode'}
            </span>
            <Settings size={14} className="settings-icon" />
          </button>

          {/* Book Appointment CTA */}
          <button 
            type="button"
            className="btn btn-gold btn-sm nav-cta animate-pulse-glow"
            onClick={() => onOpenChat()}
          >
            <Bot size={17} />
            <span>Book with Oyik AI</span>
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <a href="#specialties" onClick={() => setMobileMenuOpen(false)}>Specialties</a>
          <a href="#heritage-care" onClick={() => setMobileMenuOpen(false)}>Heritage Healing</a>
          <a href="#doctors" onClick={() => setMobileMenuOpen(false)}>Specialists</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
          <div className="mobile-drawer-actions">
            <button 
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => { setMobileMenuOpen(false); onOpenN8nConfig(); }}
            >
              <Settings size={16} /> Configure n8n Webhook
            </button>
            <button 
              type="button"
              className="btn btn-gold btn-sm"
              onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
            >
              <Bot size={16} /> Open Oyik Chatbot
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
