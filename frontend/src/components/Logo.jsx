import React from 'react';

const Logo = ({ className = '', size = 40 }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 0px 8px rgba(255, 94, 54, 0.6))' }}
      >
        {/* Background dark circle */}
        <circle cx="50" cy="50" r="46" fill="#0a0706" stroke="#ff5e36" strokeWidth="3" />
        
        {/* Abstract luxury violet curves */}
        <path
          d="M30 30 C 40 45, 45 55, 30 70"
          stroke="#e03e1a"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M70 30 C 60 45, 55 55, 70 70"
          stroke="#ff8f70"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Letter Mark 'N' in center */}
        <text
          x="50%"
          y="58%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="36"
          fontFamily="Cinzel, serif"
          fontWeight="bold"
          letterSpacing="2"
        >
          N
        </text>
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '3px',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255, 94, 54, 0.4)',
        }}
      >
        nm<span style={{ color: 'var(--text-accent)' }}>nm</span>
      </span>
    </div>
  );
};

export default Logo;
