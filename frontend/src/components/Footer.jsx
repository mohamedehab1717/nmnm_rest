import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <Logo size={48} className="logo-footer" />
          <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '14px', lineHeight: '1.8' }}>
            Experience the culinary apex of taste and aesthetics. Crafted for those who appreciate true gourmet artistry.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} className="glow-text" style={{ color: 'var(--text-accent)' }} /> Opening Hours
          </h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '14px', padding: 0 }}>
            <li className="footer-hours-row">
              <span>Monday - Thursday</span>
              <span style={{ color: 'var(--text-main)' }}>12:00 PM - 11:00 PM</span>
            </li>
            <li className="footer-hours-row">
              <span>Friday - Saturday</span>
              <span style={{ color: 'var(--text-main)' }}>12:00 PM - 01:00 AM</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '1.5rem' }}>Contact & Address</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '14px', padding: 0 }}>
            <li style={{ marginBottom: '1rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MapPin size={18} style={{ color: 'var(--primary-purple)', flexShrink: 0, marginTop: '2px' }} />
              <span>cairo , new cairo , stalemment 1</span>
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Phone size={18} style={{ color: 'var(--primary-purple)' }} />
              <span>01235668987</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Mail size={18} style={{ color: 'var(--primary-purple)' }} />
              <span>reservations@nmnm.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          &copy; {new Date().getFullYear()} nmnm Restaurant. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
