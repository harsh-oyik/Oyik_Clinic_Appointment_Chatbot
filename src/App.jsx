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

const DEFAULT_WEBHOOK_URL = 'https://oyik.cloud/webhook/754890e6-d157-481d-9fa1-32d8563e39e9/chat';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);

  // Stored n8n webhook settings (defaults to live user n8n webhook)
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [isN8nActive, setIsN8nActive] = useState(true);

  useEffect(() => {
    const savedUrl = localStorage.getItem('oyik_n8n_webhook_url');
    const savedActive = localStorage.getItem('oyik_n8n_is_active');

    // Always update to new DEFAULT_WEBHOOK_URL unless user configured a custom URL with 754890e6
    if (savedUrl && savedUrl.includes('754890e6-d157-481d-9fa1-32d8563e39e9')) {
      setWebhookUrl(savedUrl);
    } else {
      setWebhookUrl(DEFAULT_WEBHOOK_URL);
      localStorage.setItem('oyik_n8n_webhook_url', DEFAULT_WEBHOOK_URL);
    }

    if (savedActive !== null) {
      setIsN8nActive(savedActive === 'true');
    } else {
      setIsN8nActive(true);
      localStorage.setItem('oyik_n8n_is_active', 'true');
    }
  }, []);

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
    setWebhookUrl(url);
    const active = !!url;
    setIsN8nActive(active);
    localStorage.setItem('oyik_n8n_webhook_url', url);
    localStorage.setItem('oyik_n8n_is_active', active ? 'true' : 'false');
  };

  const handleToggleMode = (isLive) => {
    setIsN8nActive(isLive);
    localStorage.setItem('oyik_n8n_is_active', isLive ? 'true' : 'false');
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
      />
    </div>
  );
}
