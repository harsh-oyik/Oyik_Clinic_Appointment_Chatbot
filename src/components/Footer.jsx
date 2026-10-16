import React from 'react';
import { Bot, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenChat, onOpenN8nConfig, isN8nActive }) {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-top-grid">
          {/* Col 1: Brand & Mission */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-emblem-small">
                <svg viewBox="0 0 40 40" className="brand-svg" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="#dfb776" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M20 7 C14 15 10 23 20 33 C30 23 26 15 20 7 Z" fill="#dfb776" />
                  <circle cx="20" cy="20" r="4" fill="#123830" />
                </svg>
              </div>
              <div>
                <span className="brand-title">OYIK CLINIC</span>
                <span className="brand-subtitle">HERITAGE CARE & WELLNESS</span>
              </div>
            </div>

            <p className="footer-about">
              Blending timeless holistic traditions with contemporary clinical precision. We believe healing happens when centuries of wisdom meet modern diagnostic compassion.
            </p>

            <div className="footer-n8n-badge">
              <span className="dot-green"></span>
              <span>Chatbot Powered by n8n ({isN8nActive ? 'Live Mode' : 'Interactive Demo'})</span>
              <button 
                type="button" 
                className="footer-n8n-link"
                onClick={onOpenN8nConfig}
              >
                Configure
              </button>
            </div>
          </div>

          {/* Col 2: Clinical Specialties */}
          <div className="footer-col">
            <h4 className="footer-col-title">Specialties</h4>
            <ul className="footer-links">
              <li><a href="#specialties">Heritage Integrative Medicine</a></li>
              <li><a href="#specialties">Executive Cardiology</a></li>
              <li><a href="#specialties">Dermatology & Aesthetic Glow</a></li>
              <li><a href="#specialties">Spine & Joint Rehabilitation</a></li>
              <li><a href="#specialties">Panchakarma Detox Therapy</a></li>
            </ul>
          </div>

          {/* Col 3: Hours & Booking */}
          <div className="footer-col">
            <h4 className="footer-col-title">Clinic Hours</h4>
            <div className="footer-hours-list">
              <div className="hours-row">
                <span>Mon – Fri:</span>
                <strong>8:00 AM – 8:00 PM</strong>
              </div>
              <div className="hours-row">
                <span>Saturday:</span>
                <strong>8:30 AM – 6:30 PM</strong>
              </div>
              <div className="hours-row">
                <span>Sunday:</span>
                <strong>9:00 AM – 2:00 PM</strong>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-gold btn-sm footer-book-btn"
              onClick={() => onOpenChat()}
            >
              <Bot size={15} />
              <span>Book Appointment via Bot</span>
            </button>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="footer-col">
            <h4 className="footer-col-title">Sanctuary Location</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={17} className="text-gold" />
                <span>14 Lotus Heritage Boulevard, Central Medical District</span>
              </li>
              <li>
                <Phone size={17} className="text-gold" />
                <span>+1 (800) 555-OYIK / (020) 7946-0192</span>
              </li>
              <li>
                <Mail size={17} className="text-gold" />
                <span>appointments@oyikclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="footer-disclaimer-bar">
          <ShieldCheck size={16} className="text-gold" />
          <p>
            <strong>Medical Disclaimer:</strong> Oyik Clinic's Appointment Chatbot automates scheduling, doctor matchmaking, and general queries. For acute or life-threatening emergencies, please call your local emergency medical service (911/112) or visit the nearest emergency trauma center immediately.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Oyik Clinic & Heritage Health Sanctuary. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Patient Privacy Policy</a>
            <span className="dot-sep">•</span>
            <a href="#">Terms of Care</a>
            <span className="dot-sep">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenN8nConfig(); }}>n8n Webhook Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
