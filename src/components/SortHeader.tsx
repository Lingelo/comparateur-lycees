import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SortField, SortDir } from '../types';

interface SortHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField;
  currentDir: SortDir;
  onToggle: (field: SortField) => void;
  className?: string;
  tooltip?: string;
}

export function SortHeader({ field, label, currentField, currentDir, onToggle, className = '', tooltip }: SortHeaderProps) {
  const active = field === currentField;

  return (
    <th
      className={`cursor-pointer select-none px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 ${className}`}
      onClick={() => onToggle(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {tooltip && <TooltipIcon text={tooltip} />}
        {active && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            {currentDir === 'asc' ? (
              <path d="M6 2l4 5H2z" />
            ) : (
              <path d="M6 10l4-5H2z" />
            )}
          </svg>
        )}
      </span>
    </th>
  );
}

function TooltipIcon({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);

  const updatePos = useCallback(() => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
  }, []);

  useEffect(() => {
    if (!show) return;
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    return () => window.removeEventListener('scroll', updatePos, true);
  }, [show, updatePos]);

  return (
    <span
      ref={iconRef}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex"
    >
      <svg className="h-3.5 w-3.5 text-gray-300 hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
      {show && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs font-normal normal-case tracking-normal text-white shadow-lg"
          style={{ left: pos.x, top: pos.y, transform: 'translateX(-50%)' }}
        >
          {text}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
        </div>,
        document.body,
      )}
    </span>
  );
}
