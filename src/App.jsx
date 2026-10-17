
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
import N8nModal from './components/N8nModal';

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
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [isN8nActive, setIsN8nActive] = useState(true);

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

    // Always use the new clinic appointment webhook.
    // Do not allow an old URL saved in localStorage to override it.
    setWebhookUrl(DEFAULT_WEBHOOK_URL);
    localStorage.setItem('oyik_n8n_webhook_url', DEFAULT_WEBHOOK_URL);

    // Enable the live n8n chatbot by default.
    setIsN8nActive(true);
    localStorage.setItem('oyik_n8n_is_active', 'true');
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

  const handleSaveWebhook = (url) => {
    const cleanedUrl = (url || '').trim();

    if (!cleanedUrl) {
      setWebhookUrl(DEFAULT_WEBHOOK_URL);
      setIsN8nActive(true);
      localStorage.setItem('oyik_n8n_webhook_url', DEFAULT_WEBHOOK_URL);
      localStorage.setItem('oyik_n8n_is_active', 'true');
      return;
    }

    setWebhookUrl(cleanedUrl);
    setIsN8nActive(true);

    localStorage.setItem('oyik_n8n_webhook_url', cleanedUrl);
    localStorage.setItem('oyik_n8n_is_active', 'true');
  };

  const handleToggleMode = (isLive) => {
    setIsN8nActive(isLive);
    localStorage.setItem('oyik_n8n_is_active', String(isLive));
  };

  return (
    <div className="app-root">
      {/* Top Banner for n8n status info */}
      <div className="top-utility-strip">
        <div className="container strip-container">
          <div className="strip-left">
            <span className="strip-dot"></span>
            <span>Oyik Clinic Heritage Healthcare & Wellness • Accepting New Patients</span>
          </div>
          <div className="strip-right">
            <span className="strip-n8n-info">
              {isN8nActive ? '⚡ n8n Webhook Active' : '🧪 Chatbot running in Demo Mode'}
            </span>
            <button
              type="button"
              className="strip-btn"
              onClick={() => setIsN8nModalOpen(true)}
            >
              Configure n8n URL
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navbar
        onOpenChat={handleOpenChat}
        onOpenN8nConfig={() => setIsN8nModalOpen(true)}
        webhookUrl={webhookUrl}
        isN8nActive={isN8nActive}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onOpenChat={handleOpenChat}
          onOpenN8nConfig={() => setIsN8nModalOpen(true)}
          isN8nActive={isN8nActive}
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
        onOpenN8nConfig={() => setIsN8nModalOpen(true)}
        isN8nActive={isN8nActive}
      />

      {/* Embedded Chatbot Window */}
      <OyikChatbot
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialPrompt={chatInitialPrompt}
        webhookUrl={webhookUrl}
        isN8nActive={isN8nActive}
        onOpenN8nConfig={() => setIsN8nModalOpen(true)}
        sessionId={sessionId}
        onResetSession={handleResetSession}
      />

      {/* Floating Bottom-Right Launcher */}
      <ChatLauncher
        isOpen={isChatOpen}
        onToggle={handleToggleChat}
        isN8nActive={isN8nActive}
      />

      {/* n8n Webhook Configuration Modal */}
      <N8nModal
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
        webhookUrl={webhookUrl}
        onSaveWebhook={handleSaveWebhook}
        isN8nActive={isN8nActive}
        onToggleMode={handleToggleMode}
        sessionId={sessionId}
      />
    </div>
  );
}
