import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Sparkles, Calendar, Clock, User, Phone, CheckCircle2, 
  Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, AlertCircle, 
  Download, ExternalLink, ChevronRight, ShieldCheck, Lock, CheckCheck
} from 'lucide-react';

// Formatted message renderer with bold and clean line break support
function FormattedMessageText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="bubble-text">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="bubble-spacer" />;
        }

        // Render bold segments: **text**
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={lIdx} className="bubble-line">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function OyikChatbot({ 
  isOpen, 
  onClose, 
  initialPrompt, 
  webhookUrl, 
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
        text: "Namaste & Welcome to Oyik Clinic! 🌿 I am your personal Appointment Concierge.\n\nI can help you check specialist availability, schedule an in-clinic or telehealth consultation, or answer questions regarding our heritage and modern clinical therapies.",
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
      exp: "24 yrs clinical exp",
      nextSlot: "Today 04:30 PM",
      rating: "4.98 (340+ reviews)"
    },
    {
      id: "julian",
      name: "Dr. Julian Vance",
      specialty: "Executive Cardiology",
      image: "/assets/doctor-cardio.jpg",
      exp: "16 yrs clinical exp",
      nextSlot: "Today 03:15 PM",
      rating: "4.96 (280+ reviews)"
    },
    {
      id: "sarah",
      name: "Dr. Sarah Jensen",
      specialty: "Dermatology & Aesthetics",
      image: "/assets/doctor-derma.jpg",
      exp: "12 yrs clinical exp",
      nextSlot: "Today 05:00 PM",
      rating: "4.99 (410+ reviews)"
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

    // If webhook is configured, call the appointment concierge workflow!
    if (webhookUrl) {
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
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          text: "Our appointment concierge is currently experiencing high demand. Please try again or reach our 24/7 reception desk at (800) 555-OYIK for immediate priority scheduling.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: ["📅 Book New Appointment", "🌿 Heritage Ayurveda Consult", "❤️ Cardiology with Dr. Julian"]
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
          text: "📍 **Oyik Clinic & Heritage Health Sanctuary**\n• **Address:** 14 Lotus Heritage Boulevard, Central Medical District\n• **Consultation Hours:** Monday – Saturday: 8:00 AM – 8:00 PM\n• **Sunday:** 9:00 AM – 2:00 PM (Emergency & Prior Priority Bookings)\n• **Amenities:** Valet parking, private consultation suites, and wheelchair accessible elevator.",
          quickReplies: ["📅 Book Appointment Now", "👨‍⚕️ View Specialists"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: `Thank you for your inquiry regarding "${input}". At Oyik Clinic, we harmonize classical holistic medicine with modern diagnostic consultations. Would you like to schedule an appointment with our specialist?`,
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
        text: `Slot confirmed for **${timeStr}**. Please provide the patient's contact details to generate your verified digital appointment pass:`,
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
        text: `🎉 **Appointment Confirmed!**\n\nYour appointment reference is **#${refCode}**. A verified WhatsApp & SMS confirmation pass has been dispatched to ${patientDetails.phone}.`,
        type: 'confirmation-card',
        bookingData: updatedState,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    playChime('receive');
  };

  const handleDownloadSlip = (data) => {
    const slipText = `=================================================
             OYIK CLINIC • HERITAGE SANCTUARY
            OFFICIAL APPOINTMENT PASS & RECEIPT
=================================================
Booking Reference : ${data.referenceId || 'OYIK-2026-CONFIRMED'}
Date & Time       : ${data.date || 'Today'}, ${data.time || '11:15 AM'}
Consulting Doctor : ${data.doctor?.name || 'Dr. Ananya Sharma'}
Department        : ${data.doctor?.specialty || 'Heritage Medicine'}
Patient Name      : ${data.name || 'Valued Patient'}
Contact Number    : ${data.phone || '+1 (800) 555-OYIK'}

Sanctuary Location:
Oyik Clinic Heritage Sanctuary, 14 Lotus Blvd, Medical District
Phone: +1 (800) 555-OYIK | Email: concierge@oyikclinic.com

Instructions:
1. Please arrive 10 minutes prior to your designated slot.
2. Present this digital pass or your booking reference at reception.
3. Complimentary herbal infusions served in our heritage lounge.
=================================================`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oyik_Appointment_Pass_${data.referenceId || 'Confirmed'}.txt`;
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
      text: "Namaste & Welcome to Oyik Clinic! 🌿 I am your personal Appointment Concierge.\n\nHow may I assist your health and wellness journey today?",
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

          <div className="header-text-block">
            <div className="header-title-row">
              <h4>Oyik Medical Concierge</h4>
              <span className="header-verified-icon" title="Verified Medical Practice">
                <ShieldCheck size={14} className="text-gold" />
              </span>
              <span className="header-online-pill">
                <span className="online-indicator-dot"></span>
                <span>Active</span>
              </span>
            </div>
            <p className="header-subtitle">Heritage Sanctuary • Live Scheduling</p>
          </div>
        </div>

        {/* Header Action Icons */}
        <div className="chat-header-actions">
          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={handleResetChat}
            title="Start fresh consultation"
            aria-label="Reset consultation"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            type="button" 
            className="header-icon-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse view" : "Expand window"}
            aria-label="Toggle expansion"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button 
            type="button" 
            className="header-icon-btn close-btn" 
            onClick={onClose}
            title="Close concierge"
            aria-label="Close chatbot"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="chat-messages-body">
        {/* Confidential Session Security Banner */}
        <div className="chat-session-badge">
          <Lock size={11} className="text-gold" />
          <span>Encrypted Healthcare Session • HIPAA Confidential</span>
        </div>

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
              <FormattedMessageText text={msg.text} />

              {/* Doctor Picker Component */}
              {msg.type === 'doctor-picker' && (
                <div className="interactive-doctors-list">
                  {doctorsList.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="picker-doc-card"
                      onClick={() => handleSelectDoctor(doc)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="picker-doc-avatar-wrap">
                        <img src={doc.image} alt={doc.name} className="picker-doc-thumb" />
                        <span className="picker-doc-online-dot"></span>
                      </div>
                      <div className="picker-doc-info">
                        <div className="picker-doc-name-row">
                          <strong>{doc.name}</strong>
                          <span className="picker-doc-exp">{doc.exp}</span>
                        </div>
                        <span className="picker-doc-spec">{doc.specialty}</span>
                        <div className="picker-slot-chip">
                          <Clock size={11} />
                          <span>Earliest Slot: {doc.nextSlot}</span>
                        </div>
                      </div>
                      <div className="picker-select-btn">
                        <span>Select</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Date Picker Component */}
              {msg.type === 'date-picker' && (
                <div className="interactive-date-chips">
                  <button 
                    type="button" 
                    className="date-chip priority-chip" 
                    onClick={() => handleSelectDate("Today (Immediate Priority)")}
                  >
                    <div className="chip-icon-box"><Calendar size={13} /></div>
                    <div className="chip-text-wrap">
                      <span className="chip-primary-text">Today</span>
                      <span className="chip-sub-text">Immediate Slot</span>
                    </div>
                  </button>
                  <button 
                    type="button" 
                    className="date-chip" 
                    onClick={() => handleSelectDate("Tomorrow Morning")}
                  >
                    <div className="chip-icon-box"><Calendar size={13} /></div>
                    <div className="chip-text-wrap">
                      <span className="chip-primary-text">Tomorrow</span>
                      <span className="chip-sub-text">Morning / Afternoon</span>
                    </div>
                  </button>
                  <button 
                    type="button" 
                    className="date-chip" 
                    onClick={() => handleSelectDate("This Saturday (Weekend Clinic)")}
                  >
                    <div className="chip-icon-box"><Calendar size={13} /></div>
                    <div className="chip-text-wrap">
                      <span className="chip-primary-text">This Saturday</span>
                      <span className="chip-sub-text">Weekend Clinic</span>
                    </div>
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
                      <Clock size={12} className="time-chip-icon" />
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
                  <div className="ticket-top-banner">
                    <div className="ticket-emblem-wrap">
                      <img src="/assets/logo.png" alt="Oyik Logo" className="ticket-logo-img" />
                      <div>
                        <div className="ticket-clinic-name">OYIK CLINIC • SANCTUARY</div>
                        <div className="ticket-sub">OFFICIAL APPOINTMENT PASS</div>
                      </div>
                    </div>
                    <div className="ticket-verified-pill">
                      <CheckCircle2 size={12} />
                      <span>CONFIRMED</span>
                    </div>
                  </div>

                  <div className="ticket-ref-bar">
                    <span className="ref-title">BOOKING REFERENCE</span>
                    <strong className="ref-code">#{msg.bookingData.referenceId}</strong>
                  </div>

                  <div className="ticket-details-grid">
                    <div className="ticket-grid-item">
                      <span className="item-label">Consulting Specialist</span>
                      <strong className="item-value highlight">{msg.bookingData.doctor?.name || 'Dr. Ananya Sharma'}</strong>
                      <span className="item-sub">{msg.bookingData.doctor?.specialty || 'Heritage Medicine'}</span>
                    </div>

                    <div className="ticket-grid-item">
                      <span className="item-label">Scheduled Time</span>
                      <strong className="item-value text-gold">{msg.bookingData.date}</strong>
                      <span className="item-sub text-gold-light">{msg.bookingData.time}</span>
                    </div>

                    <div className="ticket-grid-item">
                      <span className="item-label">Patient Name</span>
                      <strong className="item-value">{msg.bookingData.name}</strong>
                      <span className="item-sub">{msg.bookingData.phone}</span>
                    </div>

                    <div className="ticket-grid-item">
                      <span className="item-label">Consultation Venue</span>
                      <strong className="item-value">Oyik Heritage Sanctuary</strong>
                      <span className="item-sub">14 Lotus Blvd • Suite 4B</span>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <button 
                      type="button" 
                      className="ticket-btn btn-slip"
                      onClick={() => handleDownloadSlip(msg.bookingData)}
                    >
                      <Download size={15} />
                      <span>Download Digital Pass</span>
                    </button>

                    <a 
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${msg.bookingData.doctor?.name || 'Oyik Clinic'}`)}&details=${encodeURIComponent(`Oyik Clinic Appointment Ref: ${msg.bookingData.referenceId}. Specialist: ${msg.bookingData.doctor?.name}`)}&location=${encodeURIComponent('Oyik Clinic Heritage Sanctuary, 14 Lotus Blvd')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ticket-btn btn-cal"
                    >
                      <Calendar size={15} />
                      <span>Add to Calendar</span>
                    </a>
                  </div>

                  <div className="ticket-barcode-footer">
                    <span className="barcode-mock">||| | |||| | |||||| || | |||| ||| |||| |</span>
                    <span className="barcode-label">Present this pass at clinic reception for priority check-in</span>
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

              <div className="bubble-footer-row">
                <span className="bubble-timestamp">{msg.timestamp}</span>
                {msg.sender === 'user' && (
                  <CheckCheck size={12} className="msg-delivered-icon" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble-row bot-row animate-fade-in">
            <div className="bot-bubble-avatar">
              <img src="/assets/chatbot-avatar.jpg" alt="Oyik AI" />
            </div>
            <div className="chat-bubble bot-bubble typing-bubble">
              <span className="typing-label">Oyik Concierge is typing</span>
              <div className="typing-dots-wrap">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="chat-input-wrapper">
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
            placeholder="Type your health inquiry or appointment need..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </form>
        <div className="chat-security-footer">
          <Lock size={10} />
          <span>Official Oyik Clinic Concierge • 256-bit Encrypted Consultation</span>
        </div>
      </div>
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
      <div className="form-card-header">
        <div className="form-header-title">
          <User size={15} className="text-gold" />
          <span>Patient Intake & Pass Details</span>
        </div>
        <span className="form-secure-tag">
          <Lock size={10} /> Confidential
        </span>
      </div>

      <div className="form-inner-group">
        <label>
          <span>Patient Full Legal Name</span>
        </label>
        <div className="input-with-icon">
          <User size={15} className="input-icon" />
          <input 
            type="text" 
            required 
            placeholder="e.g. Eleanor Vance" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
      </div>

      <div className="form-inner-group">
        <label>
          <span>Mobile / WhatsApp Number (for SMS Pass)</span>
        </label>
        <div className="input-with-icon">
          <Phone size={15} className="input-icon" />
          <input 
            type="tel" 
            required 
            placeholder="e.g. +1 (555) 019-2834" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
      </div>

      <button type="submit" className="btn btn-gold btn-sm btn-full form-submit-btn">
        <CheckCircle2 size={16} />
        <span>Generate Verified Appointment Pass</span>
      </button>

      <div className="form-footer-privacy">
        <ShieldCheck size={12} />
        <span>Your information is protected under strict clinical privacy protocols.</span>
      </div>
    </form>
  );
}
