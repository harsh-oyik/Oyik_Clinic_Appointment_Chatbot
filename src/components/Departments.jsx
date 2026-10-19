import React from 'react';
import { HeartPulse, Flower2, Sparkles, Activity, Check, ArrowRight, Bot } from 'lucide-react';

export default function Departments({ onOpenChat }) {
  const departments = [
    {
      id: "heritage",
      title: "Heritage Integrative Healing",
      icon: <Flower2 size={26} className="dept-icon-svg" />,
      badge: "Signature Sanctuary",
      desc: "Authentic classical Ayurvedic therapies, pulse diagnosis (Nadi Pariksha), and tailored herbal adaptogens harmonized with modern biochemistry.",
      treatments: ["Nadi Pulse Assessment", "Panchakarma Detoxification", "Rasayana Rejuvenation", "Chronic Stress Relief"],
      leadDoc: "Dr. Ananya Sharma",
      query: "I'd like to book a consultation in Heritage Integrative Medicine"
    },
    {
      id: "cardio",
      title: "Executive Cardiology",
      icon: <HeartPulse size={26} className="dept-icon-svg" />,
      badge: "Precision Diagnostics",
      desc: "State-of-the-art non-invasive cardiovascular screenings, continuous blood pressure telemetry, and heart health prevention protocols.",
      treatments: ["2D Echocardiogram & Color Doppler", "Stress ECG & Holter Telemetry", "Vascular Elasticity Profiling", "Lipid & Plaque Mitigation"],
      leadDoc: "Dr. Julian Vance",
      query: "I need to schedule a consultation with Executive Cardiology"
    },
    {
      id: "derma",
      title: "Dermatology & Aesthetic Glow",
      icon: <Sparkles size={26} className="dept-icon-svg" />,
      badge: "Aesthetic Wellness",
      desc: "Evidence-based clinical skincare merged with non-toxic botanical treatments for eczema, acne scarring, pigmentation, and graceful aging.",
      treatments: ["Medical Facial Sculpting", "Laser Photorejuvenation", "Holistic Barrier Repair", "Scarring & Pigmentation Care"],
      leadDoc: "Dr. Sarah Jensen",
      query: "Book an appointment for Dermatology and Aesthetic consultation"
    },
    {
      id: "ortho",
      title: "Spine & Joint Restoration",
      icon: <Activity size={26} className="dept-icon-svg" />,
      badge: "Rehabilitative Care",
      desc: "Targeted musculoskeletal therapy combining ergonomic spinal correction, therapeutic dry needling, and gentle joint mobilization.",
      treatments: ["Spinal Decompression Therapy", "Marma Energy Point Therapy", "Postural Alignment Protocol", "Chronic Joint Recovery"],
      leadDoc: "Dr. Ananya Sharma",
      query: "Book an appointment for Spine and Joint Restoration"
    }
  ];

  return (
    <section id="specialties" className="departments-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-heritage">Clinical Divisions</div>
          <h2>Specialized Heritage & Medical Care</h2>
          <p>
            Every department at Oyik Clinic is equipped with world-class medical equipment and deeply rooted therapeutic wisdom. Select a department to begin your booking with Oyik AI.
          </p>
        </div>

        <div className="departments-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="dept-card glass-card">
              <div className="dept-card-top">
                <div className="dept-icon-wrapper">
                  {dept.icon}
                </div>
                <span className="badge-tag">{dept.badge}</span>
              </div>

              <h3 className="dept-title">{dept.title}</h3>
              <p className="dept-desc">{dept.desc}</p>

              <div className="dept-treatments">
                <div className="dept-treatments-title">Core Therapies:</div>
                <ul>
                  {dept.treatments.map((t, idx) => (
                    <li key={idx}>
                      <Check size={14} className="text-gold" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dept-footer">
                <div className="dept-doc-lead">
                  <span className="doc-label">Division Lead:</span>
                  <span className="doc-name">{dept.leadDoc}</span>
                </div>

                <button 
                  type="button" 
                  className="dept-book-btn"
                  onClick={() => onOpenChat(dept.query)}
                >
                  <Bot size={15} />
                  <span>Book with AI</span>
                  <ArrowRight size={14} className="arrow-hover" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
