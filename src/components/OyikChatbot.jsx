import React, { useState, useEffect, useRef, useCallback } from 'react';
import './HdcChatbot.css';

const DEFAULT_CONFIG = {
  webhookUrl: 'https://oyik.cloud/webhook/754890e6-d157-481d-9fa1-32d8563e39e9/chat',
  botName: 'Oyik Clinic Assistant',
  subtitle: 'Usually replies in a few minutes',
  introMessage: 'Hi there 👋 Welcome to Oyik Clinic! How can I help you today — booking an appointment, treatments, or healthcare consultation?',
  inputPlaceholder: 'Type a message...',
  poweredByText: 'Oyik.AI',
  poweredByUrl: 'https://oyik.ai/',
  logoUrl: '/favicon.png',
  quickActions: [
    'I need to book an appointment',
    'I need to know about your services',
    'I need to do rescheduling'
  ],
  sourceId: 'oyik-clinic-chatbot'
};

// Safe markdown renderer supporting bold (**text**), lists, paragraphs, and gold links
function parseMarkdown(text) {
  if (!text) return '';

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getSafeUrl(rawUrl) {
    if (!rawUrl) return '';
    let s = String(rawUrl).trim().replace(/^["']|["']$/g, '');
    if (!s) return '';
    if (s.startsWith('//')) s = 'https:' + s;
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    return s;
  }

  let cleaned = text
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\*/g, '*');

  function renderInline(line) {
    let rendered = escapeHtml(line);

    // Bold: **text**
    while (rendered.match(/\*\*(.+?)\*\*/)) {
      rendered = rendered.replace(/\*\*(.+?)\*\*/, '<strong>$1</strong>');
    }

    // Markdown link: [label](url) or [label]: (url)
    rendered = rendered.replace(
      /\[([^\]]+)\]\s*(?:\(\s*([^\s)]+)\s*\)|:\s*\(?\s*([^\s)]+)\s*\)?)/gi,
      (_m, _label, url1, url2) => {
        const href = getSafeUrl(url1 || url2);
        if (!href) return '';
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Link ↗</a>`;
      }
    );

    // Markdown link pattern: [label] - http://url
    rendered = rendered.replace(
      /\[([^\]]+)\]\s*[-:]*\s*(https?:\/\/[^\s<]+)/gi,
      (_m, _label, url) => {
        const href = getSafeUrl(url);
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Link ↗</a>`;
      }
    );

    // Raw URL: https://...
    rendered = rendered.replace(
      /(^|[^"'>])(https?:\/\/[^\s<]+)/gi,
      (_m, prefix, url) => {
        const href = getSafeUrl(url);
        return `${prefix}<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Link ↗</a>`;
      }
    );

    return rendered;
  }

  const lines = cleaned.split('\n');
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.match(/^[-*] /)) {
      if (!inList) {
        html += '<ul style="margin:6px 0;padding-left:18px;">';
        inList = true;
      }
      html += `<li style="margin:4px 0;">${renderInline(trimmed.replace(/^[-*] /, ''))}</li>`;
    } else if (trimmed.match(/^\d+[.)] /)) {
      if (!inList) {
        html += '<ol style="margin:6px 0;padding-left:18px;">';
        inList = true;
      }
      html += `<li style="margin:4px 0;">${renderInline(trimmed.replace(/^\d+[.)] /, ''))}</li>`;
    } else {
      if (inList) {
        html += html.indexOf('<ol>') > html.lastIndexOf('</ol>') ? '</ol>' : '</ul>';
        inList = false;
      }
      html += `<p style="margin:0 0 6px 0;">${renderInline(trimmed)}</p>`;
    }
  }

  if (inList) {
    html += html.indexOf('<ol>') > html.lastIndexOf('</ol>') ? '</ol>' : '</ul>';
  }

  return html;
}

// Helper to recursively parse webhook responses from n8n
function parseWebhookResponse(raw) {
  const texts = [];

  function walk(obj) {
    if (!obj) return;
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          walk(JSON.parse(trimmed));
          return;
        } catch {
          // ignore json parse error
        }
      }
      if (trimmed) texts.push(trimmed);
      return;
    }
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) walk(obj[i]);
      return;
    }
    if (typeof obj === 'object') {
      const textKeys = ['output', 'message', 'text', 'reply', 'response', 'content'];
      for (let k = 0; k < textKeys.length; k++) {
        if (obj[textKeys[k]]) walk(obj[textKeys[k]]);
      }
    }
  }

  walk(raw);
  const unique = texts.filter((txt, idx) => txt && !texts.slice(0, idx).includes(txt));
  const combined = unique.join('\n\n');
  return combined
    .replace(/Heritage\s*&\s*Castle\s*(Dental\s*Clinic|Dental\s*Care)?/gi, 'Oyik Clinic')
    .replace(/Heritage\s*Dental(\s*Care)?/gi, 'Oyik Clinic');
}

export default function OyikChatbot({
  isOpen,
  onClose,
  onOpen,
  initialPrompt,
  webhookUrl,
  sessionId: parentSessionId
}) {
  const config = {
    ...DEFAULT_CONFIG,
    webhookUrl: webhookUrl || DEFAULT_CONFIG.webhookUrl
  };

  // State
  const [messages, setMessages] = useState([]);
  const [barInputVal, setBarInputVal] = useState('');
  const [panelInputVal, setPanelInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBarFocused, setIsBarFocused] = useState(false);
  const [barPlaceholder, setBarPlaceholder] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('hdc-chat-sound') !== 'off';
    } catch {
      return true;
    }
  });

  const [activeSessionId] = useState(() => {
    if (parentSessionId) return parentSessionId;
    return 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  });

  const messagesEndRef = useRef(null);
  const panelInputRef = useRef(null);
  const barInputRef = useRef(null);
  const introShownRef = useRef(false);
  const lastProcessedPromptRef = useRef(null);

  // Audio Context synthesizer for pure browser chimes
  const audioCtxRef = useRef(null);
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        // audio context unsupported
      }
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((freq, duration, type = 'sine', rampFreq = null) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (rampFreq) {
        osc.frequency.exponentialRampToValueAtTime(rampFreq, ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay restrictions
    }
  }, [soundEnabled]);

  const playSend = useCallback(() => {
    playTone(520, 0.12, 'sine', 780);
  }, [playTone]);

  const playReceive = useCallback(() => {
    playTone(680, 0.15, 'sine', 520);
  }, [playTone]);

  const playOpen = useCallback(() => {
    playTone(440, 0.1, 'sine', 660);
  }, [playTone]);

  const playClose = useCallback(() => {
    playTone(520, 0.1, 'sine', 330);
  }, [playTone]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('hdc-chat-sound', next ? 'on' : 'off');
    } catch {
      // storage unavailable
    }
  };

  // Helper: Current Time formatted
  const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add welcome intro message once
  const ensureIntro = useCallback(() => {
    if (!introShownRef.current) {
      introShownRef.current = true;
      setMessages(prev => [
        ...prev,
        {
          id: 'intro_' + Date.now(),
          who: 'bot',
          text: config.introMessage,
          time: timeNow()
        }
      ]);
    }
  }, [config.introMessage]);

  // Scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Typewriter placeholder animation for the bottom bar input
  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setBarPlaceholder(config.quickActions[0] || config.inputPlaceholder);
      return;
    }

    let phIndex = 0;
    let phChar = 0;
    let phDeleting = false;
    let timerId = null;

    function tick() {
      const phrases = config.quickActions;
      if (!phrases || !phrases.length) return;

      if (isBarFocused || barInputVal || isOpen) {
        timerId = setTimeout(tick, 400);
        return;
      }

      const full = phrases[phIndex % phrases.length];
      let delay = 55;

      if (!phDeleting) {
        phChar++;
        delay = 55;
        if (phChar >= full.length) {
          phChar = full.length;
          phDeleting = true;
          delay = 1700;
        }
      } else {
        phChar--;
        delay = 26;
        if (phChar <= 0) {
          phChar = 0;
          phDeleting = false;
          phIndex = (phIndex + 1) % phrases.length;
          delay = 400;
        }
      }

      setBarPlaceholder(full.substring(0, phChar));
      timerId = setTimeout(tick, delay);
    }

    tick();
    return () => clearTimeout(timerId);
  }, [config.quickActions, config.inputPlaceholder, isBarFocused, barInputVal, isOpen]);

  // Send message to webhook and update UI
  const handleSendMessage = useCallback(async (text) => {
    const content = (text || panelInputVal).trim();
    if (!content) return;

    setPanelInputVal('');

    // Append user message
    const userMsg = {
      id: 'u_' + Date.now(),
      who: 'user',
      text: content,
      time: timeNow()
    };
    setMessages(prev => [...prev, userMsg]);
    playSend();
    setIsTyping(true);

    try {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: content,
          message: content,
          sessionId: activeSessionId,
          timestamp: new Date().toISOString(),
          metadata: {
            message: content,
            timestamp: new Date().toISOString(),
            source: config.sourceId
          }
        })
      });

      if (!res.ok) {
        throw new Error('Status ' + res.status);
      }

      const data = await res.json();
      const reply = parseWebhookResponse(data) || "Thank you. Our clinic team has received your message.";
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'b_' + Date.now(),
          who: 'bot',
          text: reply,
          time: timeNow()
        }
      ]);
      playReceive();
      setTimeout(() => panelInputRef.current?.focus(), 80);
    } catch {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'b_err_' + Date.now(),
          who: 'bot',
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment or reach out to our clinic desk.",
          time: timeNow()
        }
      ]);
      playReceive();
      setTimeout(() => panelInputRef.current?.focus(), 80);
    }
  }, [panelInputVal, config.webhookUrl, config.sourceId, activeSessionId, playSend, playReceive]);

  // Open the panel
  const handleOpenPanel = useCallback((sendText = null) => {
    if (typeof onOpen === 'function') {
      onOpen();
    }
    playOpen();
    ensureIntro();

    if (sendText) {
      setTimeout(() => {
        handleSendMessage(sendText);
      }, 250);
    } else {
      setTimeout(() => {
        panelInputRef.current?.focus();
      }, 200);
    }
  }, [onOpen, playOpen, ensureIntro, handleSendMessage]);

  // Close the panel
  const handleClosePanel = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
    playClose();
  }, [onClose, playClose]);

  // Submit from the bottom floating capsule bar
  const handleBarSubmit = (customText = null) => {
    const val = (customText || barInputVal).trim();
    if (!val) return;
    setBarInputVal('');
    setIsBarFocused(false);
    barInputRef.current?.blur();
    handleOpenPanel(val);
  };

  // External trigger (e.g. from Hero, Doctors, Spotlight buttons)
  useEffect(() => {
    if (isOpen) {
      ensureIntro();
      setTimeout(() => panelInputRef.current?.focus(), 250);
    }
  }, [isOpen, ensureIntro]);

  useEffect(() => {
    if (initialPrompt && isOpen && lastProcessedPromptRef.current !== initialPrompt) {
      lastProcessedPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen, handleSendMessage]);

  // Global keydown: Escape to close modal
  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleClosePanel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClosePanel]);

  const isBarExpanded = isBarFocused || Boolean(barInputVal.trim());

  return (
    <div id="hdc-chatbot-widget">
      {/* =========================================================================
          1. Flyout Chat Panel Modal
          ========================================================================= */}
      <div 
        className={`hdc-chat-panel ${isOpen ? 'open' : ''}`} 
        id="hdcChatPanel"
        role="dialog"
        aria-label="Clinic Assistant Chat"
      >
        {/* Header */}
        <div className="hdc-chat-header">
          <div className="hdc-chat-avatar">
            <img 
              src={config.logoUrl} 
              alt="Clinic Logo" 
            />
          </div>

          <div className="hdc-chat-header-text">
            <div className="name">
              {config.botName} <span className="hdc-status-dot"></span>
            </div>
            <div className="sub">{config.subtitle}</div>
          </div>

          <div className="hdc-header-btns">

            {/* Close Button */}
            <button
              type="button"
              className="hdc-header-close"
              onClick={handleClosePanel}
              aria-label="Close chat"
              title="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="hdc-chat-messages" id="hdcChatMessages">
          {messages.map((m) => (
            <div key={m.id} className={`hdc-msg-row ${m.who}`}>
              <div 
                className="hdc-bubble"
                dangerouslySetInnerHTML={{ 
                  __html: m.who === 'bot' ? parseMarkdown(m.text) : m.text 
                }}
              />
              <div className="hdc-msg-meta">
                {m.who === 'bot' ? `${config.botName.split(' ')[0]} · ${m.time}` : `You · ${m.time}`}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="hdc-msg-row bot" id="hdcTypingRow">
              <div className="hdc-bubble hdc-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="hdc-chat-input-area">
          <div className="hdc-chat-input-wrap">
            <input
              ref={panelInputRef}
              type="text"
              id="hdcChatInput"
              placeholder={config.inputPlaceholder}
              value={panelInputVal}
              onChange={(e) => setPanelInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              autoComplete="off"
            />
            <button
              type="button"
              className="hdc-send-btn"
              onClick={() => handleSendMessage()}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>

          <div className="hdc-powered-by">
            Powered by{' '}
            <a href={config.poweredByUrl} target="_blank" rel="noopener noreferrer">
              {config.poweredByText}
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. Floating Bottom Pill Bar & Quick Action Chips
          ========================================================================= */}
      <div 
        className={`hdc-bar-wrap ${isOpen ? 'hdc-bar-hidden' : ''} ${isBarExpanded ? 'expanded' : ''}`}
        id="hdcBarWrap"
      >
        {/* Quick Action Chips that stagger animate up on hover/focus */}
        <div className="hdc-pills" id="hdcPills">
          {config.quickActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              className="hdc-pill"
              onClick={() => handleBarSubmit(action)}
              data-msg={action}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Capsule Input Bar */}
        <div 
          className="hdc-bar" 
          id="hdcBar"
          onClick={() => barInputRef.current?.focus()}
        >
          <input
            ref={barInputRef}
            type="text"
            className="hdc-bar-input"
            id="hdcBarInput"
            placeholder={isBarFocused ? config.inputPlaceholder : barPlaceholder}
            value={barInputVal}
            onChange={(e) => setBarInputVal(e.target.value)}
            onFocus={() => setIsBarFocused(true)}
            onBlur={() => {
              if (!barInputVal.trim()) {
                setIsBarFocused(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleBarSubmit();
              } else if (e.key === 'Escape') {
                setIsBarFocused(false);
                barInputRef.current?.blur();
              }
            }}
            autoComplete="off"
            aria-label="Message"
          />

          <button
            type="button"
            className="hdc-bar-send"
            id="hdcBarSend"
            onClick={(e) => {
              e.stopPropagation();
              if (barInputVal.trim()) {
                handleBarSubmit();
              } else {
                handleOpenPanel();
              }
            }}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
