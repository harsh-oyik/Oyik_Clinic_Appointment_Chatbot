import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, X, Sparkles } from 'lucide-react';

export default function ChatLauncher({ isOpen, onToggle, isN8nActive }) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show greeting bubble after 2 seconds on first visit
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="chat-launcher-root">
      {/* Speech Bubble Greeting */}
      {!isOpen && showTooltip && (
        <div className="launcher-tooltip animate-float">
          <div className="tooltip-header">
            <span className="tooltip-badge">
              <Sparkles size={11} />
              {isN8nActive ? 'n8n Live' : 'AI Assistant'}
            </span>
            <button 
              type="button" 
              className="tooltip-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
            >
              <X size={12} />
            </button>
          </div>
          <p className="tooltip-text">
            👋 Welcome! Need to schedule a visit? I can book your appointment in 30 seconds.
          </p>
          <button 
            type="button" 
            className="tooltip-cta"
            onClick={onToggle}
          >
            <span>Start Chat</span>
            <span className="tooltip-arrow">→</span>
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        className={`chat-launcher-btn ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? "Close chatbot" : "Open Oyik Clinic Appointment Chatbot"}
      >
        <div className="launcher-avatar-container">
          <img 
            src="/assets/chatbot-avatar.jpg" 
            alt="Oyik Chatbot Avatar" 
            className="launcher-avatar" 
          />
          <span className="launcher-status-dot"></span>
        </div>

        {/* Unread / Notification Badge */}
        {!isOpen && (
          <span className="launcher-unread-badge">
            <Sparkles size={10} />
          </span>
        )}
      </button>
    </div>
  );
}
