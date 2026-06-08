"use client";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "", iconOnly }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary shrink-0">
        {/* Left ear */}
        <ellipse cx="18" cy="42" rx="16" ry="22" fill="currentColor" opacity={0.45} />
        {/* Right ear */}
        <ellipse cx="82" cy="42" rx="16" ry="22" fill="currentColor" opacity={0.45} />
        {/* Face */}
        <circle cx="50" cy="54" r="32" fill="currentColor" opacity={0.85} />
        <circle cx="50" cy="54" r="27" fill="currentColor" opacity={0.25} />
        {/* Eyes */}
        <circle cx="38" cy="48" r="5" fill="white" />
        <circle cx="62" cy="48" r="5" fill="white" />
        <circle cx="38" cy="48" r="3" fill="#1a1a2e" />
        <circle cx="62" cy="48" r="3" fill="#1a1a2e" />
        {/* Trunk */}
        <path d="M46 60 C44 72 54 78 58 74 C60 71 56 68 53 66" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Smile */}
        <path d="M40 68 Q50 74 60 68" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {!iconOnly && (
        <span className="font-bold text-xl tracking-tight">
          OpenCodeLingo
        </span>
      )}
    </div>
  );
}
