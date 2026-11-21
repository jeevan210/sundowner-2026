import React from 'react';
import Interactive3DCard from './Interactive3DCard';

export default function Rules() {
  const rules = [
    {
      icon: 'fa-solid fa-clock',
      title: 'Pool Access Window: 4:00 PM – 6:30 PM',
      desc: 'Swimming pool access is available strictly until 6:30 PM only. Arrive early to make the absolute most of the golden-hour swim.',
      highlight: true,
      tag: 'Strict Timing'
    },
    {
      icon: 'fa-solid fa-person-swimming',
      title: 'Compulsory Swimming Costumes',
      desc: 'Appropriate swimwear is 100% compulsory for anyone entering the pool. Regular outdoor clothing is strictly not permitted.',
      highlight: true,
      tag: 'Dress Code'
    },
    {
      icon: 'fa-solid fa-shield-heart',
      title: 'Resort Pool Safety Protocols',
      desc: 'Please adhere to the resort’s pool safety guidelines and lifeguard notices at all times for a safe, enjoyable party.',
      highlight: false,
      tag: 'Safety First'
    },
    {
      icon: 'fa-solid fa-compact-disc',
      title: 'DJ Party Continues Till 8:00 PM',
      desc: 'The energetic DJ dance floor and festival sound arena will rock the open resort grounds all the way until 8:00 PM.',
      highlight: false,
      tag: 'Music'
    },
    {
      icon: 'fa-solid fa-utensils',
      title: 'All-Inclusive Complimentary Refreshments',
      desc: 'Complimentary mocktails, sizzling hot pakoras, and crispy golden French fries will be served during the entire celebration.',
      highlight: false,
      tag: 'Hospitality'
    },
    {
      icon: 'fa-solid fa-user-shield',
      title: 'Coordinator Team Assistance',
      desc: 'Please follow guidance from our official coordinators Sonika, Arzoo, Krupa, and Kuber for a smooth, VIP experience.',
      highlight: false,
      tag: 'Support'
    }
  ];

  return (
    <section className="section" id="rules">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-tag">
            <i className="fa-solid fa-shield-halved"></i> Guest Guidelines
          </div>
          <h2 className="section-h2">IMPORTANT <span className="gradient-text">INFORMATION</span></h2>
          <p className="section-desc">
            Essential guidelines to ensure a safe, smooth, and five-star celebration for all guests at Orchard Resort.
          </p>
        </div>

        <div className="rules-clean-grid">
          {rules.map((rule, idx) => (
            <Interactive3DCard key={idx} maxTilt={8} depth={12} className="rule-3d-wrap">
              <div className={`rule-clean-card ${rule.highlight ? 'highlight' : ''}`}>
                <div className="rule-clean-icon layer-3d-float">
                  <i className={rule.icon}></i>
                </div>
                <div className="rule-clean-content layer-3d-float">
                  <div className="rule-header-row">
                    <h4>{rule.title}</h4>
                    <span className="rule-tag-pill">{rule.tag}</span>
                  </div>
                  <p>{rule.desc}</p>
                </div>
              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>
    </section>
  );
}
