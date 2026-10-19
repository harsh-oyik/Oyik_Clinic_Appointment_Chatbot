import React from 'react';
import { Bot, MessageSquare, Zap, ShieldCheck, CalendarCheck, Sparkles, ArrowRight, Check } from 'lucide-react';

export default function ChatbotSpotlight({ onOpenChat }) {
  const quickPrompts = [
    { label: "Book Dr. Ananya (Heritage Medicine)", text: "I want to book an appointment with Dr. Ananya for heritage medicine." },
    { label: "Book Dr. Julian (Cardiology)", text: "I need a cardiology checkup with Dr. Julian." },
    { label: "Book Dr. Sarah (Dermatology)", text: "Schedule a skin consultation with Dr. Sarah Jensen." },
    { label: "Check Open Slots Today", text: "What appointment slots are open today?" },
    { label: "Panchakarma & Detox Therapy", text: "Tell me about Heritage Panchakarma & detox therapies." },
  ];

  return (
    <section className="chatbot-spotlight-section">
      <div className="container">
        <div className="spotlight-card glass-card-dark">
          <div className="spotlight-badge">
            <Sparkles size={15} className="text-gold" />
            <span>AI Concierge Flagship</span>
          </div>

          <div className="spotlight-grid">
            <div className="spotlight-info">
              <h2 className="spotlight-title">
                Experience Seamless Care with <span className="text-gold-gradient">Oyik AI Concierge</span>
              </h2>
              <p className="spotlight-desc">
                Trained on Oyik Clinic's specialist rosters, hospital protocols, and therapeutic schedules. The chatbot matches your clinical needs, schedules appointments in real time, and sends verified confirmations in seconds.
              </p>

              <div className="spotlight-features">
                <div className="feature-item">
                  <div className="feature-icon"><Zap size={20} /></div>
                  <div>
                    <strong>Instant Slot Reservation</strong>
                    <span>Direct doctor calendar synchronization with zero waiting time.</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><ShieldCheck size={20} /></div>
                  <div>
                    <strong>Encrypted & Confidential</strong>
                    <span>Strict patient privacy protocols adhering to medical confidentiality.</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><CalendarCheck size={20} /></div>
                  <div>
                    <strong>Digital Pass & Reminders</strong>
                    <span>Receive instant digital appointment slip, calendar invite, and SMS notification.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="spotlight-interactive">
              <div className="interactive-box">
                <div className="box-header">
                  <div className="bot-status-indicator">
                    <span className="dot-pulse"></span>
                    <span>Oyik AI Online • Ready</span>
                  </div>
                  <span className="box-tag">1-Click Fast Booking</span>
                </div>

                <p className="box-subtitle">Select any consultation inquiry below to test instant AI scheduling:</p>

                <div className="prompt-chips">
                  {quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="prompt-chip"
                      onClick={() => onOpenChat(item.text)}
                    >
                      <Sparkles size={13} className="chip-sparkle" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="box-footer">
                  <button 
                    type="button" 
                    className="btn btn-gold btn-full spotlight-cta-btn"
                    onClick={() => onOpenChat()}
                  >
                    <MessageSquare size={18} />
                    <span>Open Oyik Clinic Chatbot</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
