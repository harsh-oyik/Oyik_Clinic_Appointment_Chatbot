import React from 'react';
import { Bot, Calendar, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Hero({ onOpenChat }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Hero Copy */}
        <div className="hero-content">
          <div className="badge-heritage">
            <Sparkles size={14} color="#c59d5f" />
            <span>Integrative Heritage Healing & Modern Medicine</span>
          </div>

          <h1 className="hero-title">
            Exceptional Heritage Healthcare, <span className="text-gold-gradient">Effortlessly Scheduled.</span>
          </h1>

          <p className="hero-subtitle">
            At <strong>Oyik Clinic</strong>, we harmonize centuries-old holistic traditions with modern precision diagnostics. Meet our intelligent concierge — the <strong>Oyik Clinic Appointment Chatbot</strong> — designed to match you with top specialists and confirm your visit in 30 seconds.
          </p>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <button 
              type="button" 
              className="btn btn-gold btn-hero animate-pulse-glow"
              onClick={() => onOpenChat()}
            >
              <Bot size={20} />
              <span>Book Appointment via Oyik AI</span>
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
              <span>No telephone queues</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-gold" />
              <span>Ayurvedic & Western specialists</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-gold" />
              <span>Instant WhatsApp & Calendar sync</span>
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
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">30s</span>
              <span className="stat-label">Average AI Booking</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Image with Floating Cards */}
        <div className="hero-visual-wrapper">
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
                <div className="floating-value">4 Slots Available Now</div>
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
                <img src="/assets/chatbot-avatar.jpg" alt="Oyik AI Assistant" />
                <span className="bot-online-badge"></span>
              </div>
              <div className="bot-card-text">
                <div className="bot-card-name">Oyik AI Concierge</div>
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
