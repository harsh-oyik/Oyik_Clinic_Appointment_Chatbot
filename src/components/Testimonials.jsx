import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Meera K. Nambiar",
      role: "Chronic Migraine & Wellness Patient",
      rating: 5,
      comment: "Dr. Ananya Sharma's heritage pulse diagnosis and herbal therapy completely resolved my 4-year migraine problem in 8 weeks. Booking with the Oyik chatbot was ridiculously easy — I booked my follow-up at 11 PM in 40 seconds!",
      date: "October 2026",
      verified: true
    },
    {
      name: "Marcus Lindqvist",
      role: "Executive Health Patient",
      rating: 5,
      comment: "The precision cardiology department under Dr. Julian Vance is world class. Everything was on time. The AI chatbot sent me my appointment pass and parking instructions straight away. Outstanding experience.",
      date: "September 2026",
      verified: true
    },
    {
      name: "Sunita Roy Choudhury",
      role: "Skin Restoration Patient",
      rating: 5,
      comment: "Oyik Clinic feels like a serene sanctuary, not an intimidating hospital. Dr. Sarah Jensen gave me customized botanical skincare that restored my skin barrier. The AI chatbot is super polite and helped me choose the right time slot.",
      date: "October 2026",
      verified: true
    }
  ];

  return (
    <section id="reviews" className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-heritage">Patient Experiences</div>
          <h2>Trusted By Over 50,000 Healed Patients</h2>
          <p>
            Real feedback from individuals who transformed their health through our heritage therapies and modern medical consultations.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card glass-card">
              <div className="test-header">
                <div className="stars-row">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#dfb776" stroke="#dfb776" />
                  ))}
                </div>
                <Quote size={28} className="quote-icon" />
              </div>

              <p className="test-comment">"{rev.comment}"</p>

              <div className="test-footer">
                <div>
                  <div className="test-name-row">
                    <span className="test-name">{rev.name}</span>
                    {rev.verified && (
                      <span className="verified-pill" title="Verified Oyik Clinic Patient">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="test-role">{rev.role}</div>
                </div>
                <span className="test-date">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
