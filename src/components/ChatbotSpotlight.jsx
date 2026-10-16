import React from 'react';
import { Bot, MessageSquare, Zap, Shield, CalendarCheck, Sparkles, Send } from 'lucide-react';

export default function ChatbotSpotlight({ onOpenChat }) {
  const quickPrompts = [
    { label: "Book Dr. Ananya (Heritage)", text: "I want to book an appointment with Dr. Ananya for heritage medicine." },
    { label: "Book Dr. Julian (Cardiology)", text: "I need a cardiology checkup with Dr. Julian." },
    { label: "Book Dr. Sarah (Dermatology)", text: "Schedule a skin consultation with Dr. Sarah Jensen." },
    { label: "Check Available Slots Today", text: "What appointments are open today?" },
    { label: "Heritage Panchakarma Therapy", text: "Tell me about Heritage Panchakarma & detox therapies." },
  ];

  return (
    <section className="chatbot-spotlight-section">
      <div className="container">
        <div className="spotlight-card glass-card">
          <div className="spotlight-badge">
            <Bot size={16} />
            <span>AI Concierge Feature</span>
          </div>

          <div className="spotlight-grid">
            <div className="spotlight-info">
              <h2>Meet Oyik Clinic Appointment Chatbot</h2>
              <p>
                Trained on Oyik Clinic's specialist rosters, clinic schedules, and integrative medicine therapies. The chatbot handles your inquiries, triage, and instant appointment confirmation in seconds.
              </p>

              <div className="spotlight-features">
                <div className="feature-item">
                  <div className="feature-icon"><Zap size={18} /></div>
                  <div>
                    <strong>Instant Slot Booking</strong>
                    <span>Real-time doctor calendar integration with zero waiting.</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><Shield size={18} /></div>
                  <div>
                    <strong>Encrypted & Confidential</strong>
                    <span>Patient health info is processed with clinical confidentiality.</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><CalendarCheck size={18} /></div>
                  <div>
                    <strong>Automated Calendar & Reminders</strong>
                    <span>Receive instant booking confirmation code, calendar invite, and SMS.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="spotlight-interactive">
              <div className="interactive-box">
                <div className="box-header">
                  <div className="bot-status-indicator">
                    <span className="dot-pulse"></span>
                    <span>Oyik AI is Ready</span>
                  </div>
                  <span className="box-tag">Try 1-Click Booking</span>
                </div>

                <p className="box-subtitle">Click any inquiry below to test the appointment chatbot:</p>

                <div className="prompt-chips">
                  {quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="prompt-chip"
                      onClick={() => onOpenChat(item.text)}
                    >
                      <Sparkles size={14} className="chip-sparkle" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="box-footer">
                  <button 
                    type="button" 
                    className="btn btn-gold btn-full"
                    onClick={() => onOpenChat()}
                  >
                    <MessageSquare size={17} />
                    <span>Launch Oyik Clinic Chatbot</span>
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
