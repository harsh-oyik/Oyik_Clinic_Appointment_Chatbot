import React from 'react';
import { Bot, Star, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Doctors({ onOpenChat }) {
  const doctors = [
    {
      id: "ananya",
      name: "Dr. Ananya Sharma",
      title: "Chief of Heritage & Integrative Medicine",
      degrees: "BAMS, MD (Ayurveda), Fellow in Integrative Diagnostics",
      experience: "24+ Years Experience",
      rating: "4.98",
      reviewsCount: "820+ Reviews",
      image: "/assets/doctor-heritage.jpg",
      badge: "Heritage Master",
      available: "Today • 04:30 PM",
      bio: "Internationally acclaimed specialist combining pulse reading (Nadi Pariksha) with modern functional pathology to cure chronic ailments at their roots.",
      chatPrompt: "I want to schedule an appointment with Dr. Ananya Sharma for heritage medicine."
    },
    {
      id: "julian",
      name: "Dr. Julian Vance",
      title: "Senior Interventional Cardiologist",
      degrees: "MD, FACC, FSCAI (Harvard Medical Fellow)",
      experience: "16+ Years Experience",
      rating: "4.95",
      reviewsCount: "640+ Reviews",
      image: "/assets/doctor-cardio.jpg",
      badge: "Cardiovascular Lead",
      available: "Today • 03:15 PM",
      bio: "Pioneering preventive and rehabilitative cardiology, specializing in non-invasive telemetry, arterial elasticity, and lifestyle longevity protocols.",
      chatPrompt: "I want to schedule an appointment with Dr. Julian Vance for cardiology."
    },
    {
      id: "sarah",
      name: "Dr. Sarah Jensen",
      title: "Consultant Dermatologist & Aesthetician",
      degrees: "MD, FAAD, Board Certified Clinical Dermatology",
      experience: "12+ Years Experience",
      rating: "4.96",
      reviewsCount: "530+ Reviews",
      image: "/assets/doctor-derma.jpg",
      badge: "Aesthetics Specialist",
      available: "Today • 05:00 PM",
      bio: "Expert in gentle botanical barrier repair, laser phototherapy, and harmonized aesthetic protocols designed to enhance skin health from within.",
      chatPrompt: "I want to schedule an appointment with Dr. Sarah Jensen for dermatology."
    }
  ];

  return (
    <section id="doctors" className="doctors-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-heritage">Specialist Faculty</div>
          <h2>Consult Our Esteemed Physicians</h2>
          <p>
            Our multidisciplinary team brings decades of global clinical expertise and compassionate patient care. Click to book directly with any physician via Oyik AI.
          </p>
        </div>

        <div className="doctors-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="doc-card glass-card">
              <div className="doc-image-wrapper">
                <img src={doc.image} alt={doc.name} className="doc-image" />
                <div className="doc-image-gradient" />
                <span className="doc-badge-pill">{doc.badge}</span>
                <div className="doc-rating-badge">
                  <Star size={13} fill="#dfb776" stroke="#dfb776" />
                  <span>{doc.rating}</span>
                  <span className="rating-count">({doc.reviewsCount})</span>
                </div>
              </div>

              <div className="doc-content">
                <div className="doc-header-info">
                  <h3 className="doc-name">{doc.name}</h3>
                  <div className="doc-title">{doc.title}</div>
                  <div className="doc-degrees">{doc.degrees}</div>
                </div>

                <p className="doc-bio">{doc.bio}</p>

                <div className="doc-meta-row">
                  <div className="doc-experience">
                    <Award size={15} className="text-gold" />
                    <span>{doc.experience}</span>
                  </div>

                  <div className="doc-slot-status">
                    <span className="live-dot-pulse"></span>
                    <Clock size={13} />
                    <span>{doc.available}</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-gold btn-full doc-book-btn"
                  onClick={() => onOpenChat(doc.chatPrompt)}
                >
                  <Bot size={17} />
                  <span>Book with {doc.name.split(' ')[1]}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
