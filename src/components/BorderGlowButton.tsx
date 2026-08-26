import React, { useRef, useState } from 'react';

interface BorderGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold';
  className?: string;
  glowColors?: string[];
  disabled?: boolean;
}

export const BorderGlowButton: React.FC<BorderGlowButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  glowColors = ['#8BC53D', '#E2F0CC', '#8BC53D'],
  disabled = false,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const gradientString = `radial-gradient(120px circle at ${coords.x}% ${coords.y}%, ${glowColors.join(', ')}, transparent 80%)`;

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all duration-200 select-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
      } ${className}`}
      {...props}
    >
      {/* Outer border glow tracker */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: isHovered
            ? gradientString
            : `linear-gradient(135deg, ${glowColors[0]}80, ${glowColors[1]}60, ${glowColors[2]}80)`,
          opacity: disabled ? 0.2 : isHovered ? 1 : 0.65
        }}
      />

      {/* Pulsing subtle ambient background glow */}
      {!disabled && (
        <div
          className="absolute -inset-1 rounded-2xl blur-md opacity-30 group-hover:opacity-70 transition duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, ${glowColors[0]}, ${glowColors[1]}, ${glowColors[2]})`
          }}
        />
      )}

      {/* Button Interior */}
      <div
        className={`relative w-full h-full rounded-[14px] px-6 py-3.5 flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-widest transition-colors duration-200 ${
          variant === 'primary'
            ? 'bg-[#8BC53D] text-[#011207] group-hover:bg-[#8BC53D]/95 shadow-md shadow-[#8BC53D]/25'
            : variant === 'gold'
            ? 'bg-[#E2F0CC] text-[#011207] group-hover:bg-[#E2F0CC]/95'
            : 'bg-[#012F13] text-[#8BC53D] group-hover:text-white group-hover:bg-[#073B1B]'
        }`}
      >
        {children}
      </div>
    </button>
  );
};
