import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatbotSpotlight from './components/ChatbotSpotlight';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import OyikChatbot from './components/OyikChatbot';
import ChatLauncher from './components/ChatLauncher';

const DEFAULT_WEBHOOK_URL =
  'https://oyik.cloud/webhook/754890e6-d157-481d-9fa1-32d8563e39e9/chat';

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [webhookUrl] = useState(DEFAULT_WEBHOOK_URL);

  // In-memory session ID generated fresh on every full page refresh.
  // Not restored from cookies, localStorage, or sessionStorage.
  const [sessionId, setSessionId] = useState(() => generateSessionId());

  useEffect(() => {
    // Purge any legacy persisted session ID from storage
    try {
      localStorage.removeItem('oyik_chatbot_session');
      sessionStorage.removeItem('oyik_chatbot_session');
    } catch (e) {
      // Ignore storage restrictions
    }
  }, []);

  const handleResetSession = () => {
    const newId = generateSessionId();
    setSessionId(newId);
    return newId;
  };

  const handleOpenChat = (prompt = '') => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div className="app-root">
      {/* Top Professional Clinic Header Strip */}
      <div className="top-utility-strip">
        <div className="container strip-container">
          <div className="strip-left">
            <span className="strip-dot"></span>
            <span>Oyik Clinic & Heritage Health Sanctuary • Accepting New In-Clinic & Telehealth Patients</span>
          </div>
          <div className="strip-right">
            <span className="strip-schedule-info">
              Mon – Sat: 8:00 AM – 8:00 PM • Valet Parking & Accessible Elevator
            </span>
            <a href="tel:+18005556945" className="strip-btn">
              Emergency & Reception: (800) 555-OYIK
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navbar
        onOpenChat={handleOpenChat}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onOpenChat={handleOpenChat}
        />

        {/* Chatbot Spotlight Feature */}
        <ChatbotSpotlight onOpenChat={handleOpenChat} />

        {/* Clinical & Heritage Specialties */}
        <Departments onOpenChat={handleOpenChat} />

        {/* Specialist Doctors Roster */}
        <Doctors onOpenChat={handleOpenChat} />

        {/* How It Works Booking Flow */}
        <HowItWorks onOpenChat={handleOpenChat} />

        {/* Patient Reviews */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer
        onOpenChat={handleOpenChat}
      />

      {/* Embedded Chatbot Window */}
      <OyikChatbot
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialPrompt={chatInitialPrompt}
        webhookUrl={webhookUrl}
        sessionId={sessionId}
        onResetSession={handleResetSession}
      />

      {/* Floating Bottom-Right Launcher */}
      <ChatLauncher
        isOpen={isChatOpen}
        onToggle={handleToggleChat}
      />
    </div>
  );
}
