import React from 'react';
import { Bot, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowRight, Star, HeartPulse } from 'lucide-react';

export default function Hero({ onOpenChat }) {
  return (
    <section className="hero-section">
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="container hero-container">
        {/* Left Column: Hero Copy */}
        <div className="hero-content">
          <div className="badge-heritage">
            <Sparkles size={14} className="text-gold" />
            <span>Integrative Heritage Healing & Modern Diagnostics</span>
          </div>

          <h1 className="hero-title">
            Exceptional Heritage Healthcare, <span className="text-gold-gradient">Effortlessly Scheduled.</span>
          </h1>

          <p className="hero-subtitle">
            At <strong>Oyik Clinic</strong>, we harmonize centuries-old holistic wisdom with state-of-the-art medical diagnostics. Connect instantly with our intelligent AI concierge — designed to match you with top physicians and confirm your visit in seconds.
          </p>

          {/* Social Proof Trust Stack */}
          <div className="hero-trust-bar">
            <div className="avatar-stack">
              <img src="/assets/doctor-heritage.jpg" alt="Doctor" className="stack-avatar" />
              <img src="/assets/doctor-cardio.jpg" alt="Doctor" className="stack-avatar" />
              <img src="/assets/doctor-derma.jpg" alt="Doctor" className="stack-avatar" />
              <div className="stack-avatar-count">50k+</div>
            </div>
            <div className="trust-text-group">
              <div className="trust-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#dfb776" stroke="#dfb776" />
                ))}
                <span className="trust-score">4.98/5.0</span>
              </div>
              <span className="trust-caption">Over 50,000 Verified Consultations</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <button 
              type="button" 
              className="btn btn-gold btn-hero animate-pulse-glow"
              onClick={() => onOpenChat()}
            >
              <Bot size={20} />
              <span>Book Consultation via Oyik AI</span>
            </button>

            <a 
              href="#specialties" 
              className="btn btn-outline"
            >
              <span>Explore Specialties</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Key Value Points */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-gold" />
              <span>Zero Waiting Queues</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-gold" />
              <span>Ayurvedic & Western Faculty</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-gold" />
              <span>Instant Digital Pass & Calendar Sync</span>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="hero-stats-grid">
            <div className="stat-card">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Patients Healed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">Clinical Satisfaction</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">30s</span>
              <span className="stat-label">Average AI Booking</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Image with Floating Cards */}
        <div className="hero-visual-wrapper">
          <div className="hero-visual-glow" aria-hidden="true" />
          <div className="hero-image-frame">
            <img 
              src="/assets/hero-banner.jpg" 
              alt="Oyik Clinic Luxury Heritage Interior" 
              className="hero-main-img" 
            />
            <div className="hero-img-overlay"></div>

            {/* Floating Card 1: Live Status */}
            <div className="floating-card status-floating-card animate-float">
              <div className="floating-icon-wrap">
                <span className="live-indicator"></span>
                <Clock size={18} color="#123830" />
              </div>
              <div>
                <div className="floating-label">Appointments Today</div>
                <div className="floating-value">4 Open Priority Slots</div>
              </div>
            </div>

            {/* Floating Card 2: Oyik AI Chatbot Preview Trigger */}
            <div 
              className="floating-card bot-floating-card"
              onClick={() => onOpenChat("I'd like to book an appointment today")}
              role="button"
              tabIndex={0}
            >
              <div className="bot-avatar-thumb">
                <img src="/favicon.png" alt="Oyik AI Assistant" />
                <span className="bot-online-badge"></span>
              </div>
              <div className="bot-card-text">
                <div className="bot-card-name">Oyik AI Assistant</div>
                <div className="bot-card-prompt">"Looking for Dr. Ananya or Cardiology?"</div>
              </div>
              <span className="bot-arrow-btn">
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
