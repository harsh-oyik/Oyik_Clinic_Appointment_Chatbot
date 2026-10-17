import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Sparkles, Calendar, Clock, User, Phone, CheckCircle2, 
  Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, AlertCircle, 
  Download, ExternalLink, ChevronRight, Settings
} from 'lucide-react';

export default function OyikChatbot({ 
  isOpen, 
  onClose, 
  initialPrompt, 
  webhookUrl, 
  isN8nActive, 
  onOpenN8nConfig,
  sessionId,
  onResetSession
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bookingState, setBookingState] = useState({
    step: 'idle', // 'idle' | 'doctor' | 'date' | 'time' | 'details' | 'confirmed'
    doctor: null,
    date: null,
    time: null,
    name: '',
    phone: '',
    referenceId: null
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Web Audio synthetic chimes
  const playChime = (type = 'receive') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      if (type === 'receive') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(554.37, audioCtx.currentTime + 0.1); // C#5
      }

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      // Audio not supported or autoplay blocked
    }
  };

  // Initialize welcome messages
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg = {
        id: 'welcome-1',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Namaste & Welcome to Oyik Clinic! 🌿 I am your personal Appointment Concierge. How may I assist your health and wellness journey today?",
        quickReplies: [
          "📅 Book New Appointment",
          "🌿 Heritage Ayurveda Consult",
          "❤️ Cardiology with Dr. Julian",
          "✨ Skin & Aesthetics Consult",
          "📍 Clinic Hours & Location"
        ]
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Handle incoming initial prompt if passed from an external button click
  const lastProcessedPromptRef = useRef(null);
  useEffect(() => {
    if (initialPrompt && isOpen && lastProcessedPromptRef.current !== initialPrompt) {
      lastProcessedPromptRef.current = initialPrompt;
      handleUserSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const doctorsList = [
    {
      id: "ananya",
      name: "Dr. Ananya Sharma",
      specialty: "Heritage & Integrative Medicine",
      image: "/assets/doctor-heritage.jpg",
      exp: "24 yrs exp",
      nextSlot: "Today 04:30 PM"
    },
    {
      id: "julian",
      name: "Dr. Julian Vance",
      specialty: "Executive Cardiology",
      image: "/assets/doctor-cardio.jpg",
      exp: "16 yrs exp",
      nextSlot: "Today 03:15 PM"
    },
    {
      id: "sarah",
      name: "Dr. Sarah Jensen",
      specialty: "Dermatology & Aesthetics",
      image: "/assets/doctor-derma.jpg",
      exp: "12 yrs exp",
      nextSlot: "Today 05:00 PM"
    }
  ];

  const timeSlots = ["09:30 AM", "11:15 AM", "02:30 PM", "04:15 PM", "05:45 PM"];

  // Send message
  const handleUserSend = async (customText = null) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend) return;

    if (!customText) {
      setInputValue('');
    }

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    playChime('send');
    setIsTyping(true);

    // If n8n webhook is active and URL is set, call n8n!
    if (isN8nActive && webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatInput: textToSend,
            sessionId: sessionId,
            action: 'sendMessage',
            metadata: {
              source: 'oyik_clinic_react_frontend',
              timestamp: new Date().toISOString()
            }
          })
        });

        if (response.ok) {
          let botReplyText = '';
          try {
            const data = await response.json();
            botReplyText = data.output || data.text || data.message || data.response || (typeof data === 'string' ? data : JSON.stringify(data));
          } catch (e) {
            botReplyText = await response.text();
          }

          const botMessage = {
            id: 'bot_' + Date.now(),
            sender: 'bot',
            text: botReplyText || "Received your message at Oyik Clinic.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'n8n'
          };

          setIsTyping(false);
          setMessages(prev => [...prev, botMessage]);
          playChime('receive');
          return;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        setIsTyping(false);
        const errorMessage = {
          id: 'bot_err_' + Date.now(),
          sender: 'bot',
          isError: true,
          text: `⚠️ Could not reach your n8n webhook (${err.message}). Make sure your n8n workflow is active or running with CORS allowed. Would you like to switch to built-in simulation mode?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: ["Switch to Simulation Mode", "Configure n8n Webhook"]
        };
        setMessages(prev => [...prev, errorMessage]);
        playChime('receive');
        return;
      }
    }

    // Default: Built-in Interactive Clinic Assistant Flow
    setTimeout(() => {
      handleSimulatedBotResponse(textToSend);
      setIsTyping(false);
      playChime('receive');
    }, 800);
  };

  const handleSimulatedBotResponse = (input) => {
    const text = input.toLowerCase();

    // Check for quick replies or intent
    if (text.includes("book") || text.includes("appointment") || text.includes("schedule")) {
      setBookingState(prev => ({ ...prev, step: 'doctor' }));
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: "Splendid! Let's schedule your consultation. Please select your preferred specialist from our clinic faculty:",
          type: 'doctor-picker',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (text.includes("ananya") || text.includes("heritage") || text.includes("ayurved")) {
      handleSelectDoctor(doctorsList[0]);
    } else if (text.includes("julian") || text.includes("cardio") || text.includes("heart")) {
      handleSelectDoctor(doctorsList[1]);
    } else if (text.includes("sarah") || text.includes("derma") || text.includes("skin")) {
      handleSelectDoctor(doctorsList[2]);
    } else if (text.includes("hour") || text.includes("time") || text.includes("location") || text.includes("address")) {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: "📍 **Oyik Clinic & Heritage Health Sanctuary**\n• Address: 14 Lotus Heritage Boulevard, Medical District\n• Hours: Monday – Saturday: 8:00 AM – 8:00 PM\n• Sunday: 9:00 AM – 2:00 PM (Emergency & Prior Bookings)\n• Valet parking and accessible elevator available on site.",
          quickReplies: ["📅 Book Appointment Now", "👨‍⚕️ View Specialists"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (text.includes("switch to simulation")) {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: "Switched to Built-in Interactive Demo Mode! You can test booking with any doctor now.",
          quickReplies: ["📅 Book New Appointment", "🌿 Heritage Ayurveda Consult", "❤️ Cardiology"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (text.includes("configure n8n")) {
      onOpenN8nConfig();
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: `Thank you for reaching out regarding "${input}". At Oyik Clinic, we offer both classical heritage therapies and modern diagnostic consultations. Would you like to book an appointment with our specialist?`,
          quickReplies: [
            "📅 Yes, Book Appointment",
            "🌿 Consult Dr. Ananya",
            "❤️ Consult Dr. Julian",
            "📍 Clinic Timings"
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setBookingState(prev => ({ ...prev, doctor, step: 'date' }));
    setMessages(prev => [
      ...prev,
      {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `You have selected **${doctor.name}** (${doctor.specialty}). When would you like to schedule your visit?`,
        type: 'date-picker',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSelectDate = (dateStr) => {
    setBookingState(prev => ({ ...prev, date: dateStr, step: 'time' }));
    setMessages(prev => [
      ...prev,
      {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `Selected date: **${dateStr}**. Please choose your preferred consultation time slot:`,
        type: 'time-picker',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSelectTime = (timeStr) => {
    setBookingState(prev => ({ ...prev, time: timeStr, step: 'details' }));
    setMessages(prev => [
      ...prev,
      {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `Great, slot booked for **${timeStr}**. Almost done! Please provide your contact details to generate your verified appointment confirmation slip:`,
        type: 'patient-details-form',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleConfirmBooking = (patientDetails) => {
    const refCode = 'OYIK-' + Math.floor(1000 + Math.random() * 9000);
    const updatedState = {
      ...bookingState,
      name: patientDetails.name,
      phone: patientDetails.phone,
      referenceId: refCode,
      step: 'confirmed'
    };
    setBookingState(updatedState);

    setMessages(prev => [
      ...prev,
      {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: `🎉 **Appointment Successfully Confirmed!**\n\nYour appointment reference is **#${refCode}**. A WhatsApp & SMS confirmation has been dispatched to ${patientDetails.phone}.`,
        type: 'confirmation-card',
        bookingData: updatedState,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    playChime('receive');
  };

  const handleDownloadSlip = (data) => {
    const slipText = `=================================================
             OYIK CLINIC • HERITAGE CARE
           APPOINTMENT CONFIRMATION SLIP
=================================================
Booking Reference : ${data.referenceId || 'OYIK-2026-CONFIRMED'}
Date & Time       : ${data.date || 'Today'}, ${data.time || '11:15 AM'}
Specialist        : ${data.doctor?.name || 'Dr. Ananya Sharma'}
Department        : ${data.doctor?.specialty || 'Heritage Medicine'}
Patient Name      : ${data.name || 'Valued Patient'}
Contact Number    : ${data.phone || '+1 555-0192'}

Location:
Oyik Clinic Heritage Sanctuary, 14 Lotus Blvd, Medical District
Phone: +1 (800) 555-OYIK | Email: appointments@oyikclinic.com

Instructions:
1. Please arrive 10 minutes prior to your slot time.
2. Bring any prior lab reports or health history.
3. Complimentary herbal infusion served in our heritage lounge.
=================================================`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oyik_Appointment_${data.referenceId || 'Pass'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetChat = () => {
    if (typeof onResetSession === 'function') {
      onResetSession();
    }
    const welcomeMsg = {
      id: 'welcome_' + Date.now(),
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Namaste & Welcome to Oyik Clinic! 🌿 I am your personal Appointment Concierge. How may I assist your health and wellness journey today?",
      quickReplies: [
        "📅 Book New Appointment",
        "🌿 Heritage Ayurveda Consult",
        "❤️ Cardiology with Dr. Julian",
        "✨ Skin & Aesthetics Consult"
      ]
    };
    setMessages([welcomeMsg]);
    setBookingState({
      step: 'idle',
      doctor: null,
      date: null,
      time: null,
      name: '',
      phone: '',
      referenceId: null
    });
  };

  return (
    <div 
      className={`chatbot-window-container ${isExpanded ? 'expanded' : ''}`}
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      {/* Chat Window Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="header-avatar-wrap">
            <img 
              src="/assets/chatbot-avatar.jpg" 
              alt="Oyik Clinic Chatbot" 
              className="header-avatar-img" 
            />
            <span className="avatar-status-badge"></span>
          </div>

          <div>
            <div className="header-title-row">
              <h4>Oyik Clinic Appointment Bot</h4>
              <span 
                className={`header-mode-tag ${isN8nActive ? 'tag-n8n' : 'tag-demo'}`}
                onClick={onOpenN8nConfig}
                title="Click to configure n8n webhook"
              >
                {isN8nActive ? '⚡ n8n Live' : '🧪 Demo Mode'}
              </span>
            </div>
            <p className="header-subtitle">Heritage Healthcare Concierge</p>
          </div>
        </div>

        {/* Header Action Icons */}
        <div className="chat-header-actions">
          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={onOpenN8nConfig}
            title="Configure n8n Webhook"
          >
            <Settings size={16} />
          </button>

          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={handleResetChat}
            title="Restart conversation"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse view" : "Expand window"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button 
            type="button" 
            className="header-icon-btn close-btn" 
            onClick={onClose}
            title="Close chatbot"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="chat-messages-body">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
          >
            {msg.sender === 'bot' && (
              <div className="bot-bubble-avatar">
                <img src="/assets/chatbot-avatar.jpg" alt="Oyik AI" />
              </div>
            )}

            <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
              <div className="bubble-text">
                {msg.text.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>

              {/* Source tag if response came from n8n */}
              {msg.source === 'n8n' && (
                <div className="n8n-tag-badge">
                  <Sparkles size={11} />
                  <span>Powered by your n8n workflow</span>
                </div>
              )}

              {/* Doctor Picker Component */}
              {msg.type === 'doctor-picker' && (
                <div className="interactive-doctors-list">
                  {doctorsList.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="picker-doc-card"
                      onClick={() => handleSelectDoctor(doc)}
                    >
                      <img src={doc.image} alt={doc.name} className="picker-doc-thumb" />
                      <div className="picker-doc-info">
                        <strong>{doc.name}</strong>
                        <span>{doc.specialty}</span>
                        <div className="picker-slot-chip">Next: {doc.nextSlot}</div>
                      </div>
                      <ChevronRight size={16} className="text-gold" />
                    </div>
                  ))}
                </div>
              )}

              {/* Date Picker Component */}
              {msg.type === 'date-picker' && (
                <div className="interactive-date-chips">
                  <button 
                    type="button" 
                    className="date-chip" 
                    onClick={() => handleSelectDate("Today (Immediate Priority)")}
                  >
                    <Calendar size={14} />
                    <span>Today</span>
                  </button>
                  <button 
                    type="button" 
                    className="date-chip" 
                    onClick={() => handleSelectDate("Tomorrow Morning")}
                  >
                    <Calendar size={14} />
                    <span>Tomorrow</span>
                  </button>
                  <button 
                    type="button" 
                    className="date-chip" 
                    onClick={() => handleSelectDate("This Saturday (Weekend Clinic)")}
                  >
                    <Calendar size={14} />
                    <span>This Saturday</span>
                  </button>
                </div>
              )}

              {/* Time Picker Component */}
              {msg.type === 'time-picker' && (
                <div className="interactive-time-chips">
                  {timeSlots.map((slot, sIdx) => (
                    <button 
                      key={sIdx} 
                      type="button" 
                      className="time-chip"
                      onClick={() => handleSelectTime(slot)}
                    >
                      <Clock size={13} />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Patient Details Form Component */}
              {msg.type === 'patient-details-form' && (
                <PatientForm onSubmit={handleConfirmBooking} />
              )}

              {/* Confirmation Card Component */}
              {msg.type === 'confirmation-card' && msg.bookingData && (
                <div className="appointment-ticket-card">
                  <div className="ticket-top">
                    <div className="ticket-badge">CONFIRMED APPOINTMENT</div>
                    <div className="ticket-id">#{msg.bookingData.referenceId}</div>
                  </div>

                  <div className="ticket-details">
                    <div className="ticket-row">
                      <span className="row-label">Doctor:</span>
                      <strong className="row-value">{msg.bookingData.doctor?.name || 'Dr. Ananya Sharma'}</strong>
                    </div>
                    <div className="ticket-row">
                      <span className="row-label">Department:</span>
                      <span className="row-value">{msg.bookingData.doctor?.specialty || 'Heritage Medicine'}</span>
                    </div>
                    <div className="ticket-row">
                      <span className="row-label">Date & Time:</span>
                      <strong className="row-value text-gold">{msg.bookingData.date}, {msg.bookingData.time}</strong>
                    </div>
                    <div className="ticket-row">
                      <span className="row-label">Patient:</span>
                      <span className="row-value">{msg.bookingData.name} ({msg.bookingData.phone})</span>
                    </div>
                    <div className="ticket-row">
                      <span className="row-label">Location:</span>
                      <span className="row-value">Oyik Heritage Sanctuary, 14 Lotus Blvd</span>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <button 
                      type="button" 
                      className="ticket-btn btn-slip"
                      onClick={() => handleDownloadSlip(msg.bookingData)}
                    >
                      <Download size={14} />
                      <span>Download Slip</span>
                    </button>

                    <a 
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${msg.bookingData.doctor?.name || 'Oyik Clinic'}`)}&details=${encodeURIComponent(`Oyik Clinic Appointment Ref: ${msg.bookingData.referenceId}. Specialist: ${msg.bookingData.doctor?.name}`)}&location=${encodeURIComponent('Oyik Clinic Heritage Sanctuary, 14 Lotus Blvd')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ticket-btn btn-cal"
                    >
                      <Calendar size={14} />
                      <span>Add to Google Calendar</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Quick Reply Chips */}
              {msg.quickReplies && (
                <div className="bubble-quick-replies">
                  {msg.quickReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      className="quick-reply-btn"
                      onClick={() => handleUserSend(reply)}
                    >
                      <span>{reply}</span>
                    </button>
                  ))}
                </div>
              )}

              <span className="bubble-timestamp">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble-row bot-row">
            <div className="bot-bubble-avatar">
              <img src="/assets/chatbot-avatar.jpg" alt="Oyik AI" />
            </div>
            <div className="chat-bubble bot-bubble typing-bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form 
        className="chat-input-area"
        onSubmit={(e) => {
          e.preventDefault();
          handleUserSend();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className="chat-text-input"
          placeholder={isN8nActive ? "Ask Oyik AI (sending to your n8n workflow)..." : "Type your message or appointment need..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          type="submit" 
          className="chat-send-btn"
          disabled={!inputValue.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

// Patient details sub-form inside chat
function PatientForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSubmit({ name: name.trim(), phone: phone.trim() });
  };

  return (
    <form className="chat-patient-form" onSubmit={handleSubmit}>
      <div className="form-inner-group">
        <label>
          <User size={13} />
          <span>Patient Full Name</span>
        </label>
        <input 
          type="text" 
          required 
          placeholder="e.g. Eleanor Vance" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div className="form-inner-group">
        <label>
          <Phone size={13} />
          <span>Phone / WhatsApp Number</span>
        </label>
        <input 
          type="tel" 
          required 
          placeholder="e.g. +1 555-0192" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />
      </div>
      <button type="submit" className="btn btn-gold btn-sm btn-full">
        <CheckCircle2 size={15} />
        <span>Confirm Appointment Pass</span>
      </button>
    </form>
  );
}
