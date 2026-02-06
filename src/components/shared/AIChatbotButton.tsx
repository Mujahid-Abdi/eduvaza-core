import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIChatbot } from './AIChatbot';

export const AIChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 100, right: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  console.log('=== CHATBOT BUTTON RENDER ===');
  console.log('isOpen:', isOpen);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newTop = e.clientY - dragStartPos.current.y;
      const maxTop = window.innerHeight - 60;
      
      setPosition({
        top: Math.max(60, Math.min(newTop, maxTop)),
        right: 20,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isMobile) return; // Only left click on desktop
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY - position.top,
    };
  };

  const handleClick = () => {
    console.log('=== CHATBOT BUTTON CLICKED ===');
    console.log('isDragging:', isDragging);
    if (!isDragging) {
      console.log('Opening chatbot, setting isOpen to:', !isOpen);
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <div
        ref={buttonRef}
        className={`fixed z-50 group ${isMobile ? 'bottom-4 right-4' : ''}`}
        style={isMobile ? {} : {
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        <div className="relative">
          {/* Drag Handle - Desktop only */}
          {!isMobile && (
            <div
              className="absolute -left-6 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
              onMouseDown={handleMouseDown}
            >
              <div className="bg-primary/80 rounded-l-lg p-1">
                <GripVertical className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}

          {/* Main Button */}
          <Button
            size="lg"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
            onClick={handleClick}
          >
            <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </Button>

          {/* Tooltip - Desktop only */}
          {!isMobile && (
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="bg-popover text-popover-foreground text-sm px-3 py-1 rounded-md shadow-md">
                AI Assistant
              </div>
            </div>
          )}
        </div>
      </div>

      <AIChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
