import React from 'react';
import { MessageSquareCode, CalendarDays, CheckCircle, ArrowRight, Bot, Smartphone, Clock } from 'lucide-react';

export default function HowItWorks({ onOpenChat }) {
  const steps = [
    {
      num: "01",
      icon: <MessageSquareCode size={28} color="#c59d5f" />,
      title: "Chat with Oyik Bot",
      desc: "Tap the booking button anywhere on this page or the floating concierge. Tell Oyik your symptoms or select your preferred doctor and specialty.",
      tip: "Takes under 20 seconds"
    },
    {
      num: "02",
      icon: <CalendarDays size={28} color="#c59d5f" />,
      title: "Choose Date & Time Slot",
      desc: "Browse real-time open slots for today or upcoming dates. Select between In-Person Clinic Visit or High-Definition Teleconsultation.",
      tip: "Live synchronized calendar"
    },
    {
      num: "03",
      icon: <CheckCircle size={28} color="#c59d5f" />,
      title: "Instant Confirmation & Slip",
      desc: "Receive your unique Oyik Booking ID, instant Google Calendar invite link, and downloadable clinic appointment slip with SMS notification.",
      tip: "Instant confirmation slip"
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-heritage">Simple & Seamless</div>
          <h2>How The Oyik AI Appointment System Works</h2>
          <p>
            Say goodbye to hold music, manual receptionist scheduling, or missed appointments. Our n8n-powered chatbot automates your appointment workflow smoothly.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card glass-card">
              <div className="step-top">
                <span className="step-number">{step.num}</span>
                <div className="step-icon-wrap">{step.icon}</div>
              </div>

              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>

              <div className="step-footer">
                <span className="step-tip">
                  <Clock size={13} className="text-gold" />
                  {step.tip}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="how-cta-banner glass-card">
          <div className="banner-left">
            <div className="banner-icon">
              <Bot size={30} color="#123830" />
            </div>
            <div>
              <h3>Ready to experience frictionless scheduling?</h3>
              <p>Our chatbot is ready to answer questions, check clinic slots, and secure your visit now.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-gold banner-cta"
            onClick={() => onOpenChat()}
          >
            <Bot size={18} />
            <span>Launch Chatbot Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
