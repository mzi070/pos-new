import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimer, setShowTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    setShowTimer(timer);
  };

  const handleMouseLeave = () => {
    if (showTimer) clearTimeout(showTimer);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none`}
        >
          {content}
          <div
            className={`absolute w-1 h-1 bg-gray-900 ${
              position === 'top' ? 'top-full' : position === 'bottom' ? 'bottom-full' : ''
            } left-1/2 -translate-x-1/2`}
          />
        </div>
      )}
    </div>
  );
}

export function HelpText({ text, children }: { text: string; children: ReactNode }) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap z-50">
        {text}
      </div>
    </div>
  );
}
