'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id?: string;
  number?: string;
  index?: string;
  title?: string;
  question?: string;
  answer?: React.ReactNode;
  content?: React.ReactNode;
}

export interface AnimatedAccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultOpenIndex?: number;
  className?: string;
}

export function AnimatedAccordion({
  items,
  allowMultiple = false,
  defaultOpenIndex = -1,
  className,
}: AnimatedAccordionProps) {
  const [openIndices, setOpenIndices] = React.useState<number[]>(
    defaultOpenIndex >= 0 ? [defaultOpenIndex] : []
  );

  const toggle = (idx: number) => {
    setOpenIndices((prev) => {
      const isOpen = prev.includes(idx);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== idx) : [...prev, idx];
      }
      return isOpen ? [] : [idx];
    });
  };

  return (
    <div className={cn('animated-accordion-list', className)}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const itemNumber = item.index || item.number || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
        const headingText = item.title || item.question || '';
        const bodyContent = item.content || item.answer;

        return (
          <div
            key={item.id || headingText || idx}
            className={cn('accordion-row-unit accordion-item', isOpen && 'is-expanded')}
          >
            <button
              type="button"
              className="accordion-trigger-row accordion-trigger"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              id={`accordion-btn-${idx}`}
              aria-controls={`accordion-panel-${idx}`}
            >
              <span className="accordion-item-num" aria-hidden="true">{itemNumber}</span>
              <span className="accordion-item-heading">{headingText}</span>
              <span className={cn('accordion-icon-wrap', isOpen && 'rotate-active')} aria-hidden="true">
                <Plus size={17} className="accordion-plus-icon" />
              </span>
            </button>

            <div
              id={`accordion-panel-${idx}`}
              role="region"
              aria-labelledby={`accordion-btn-${idx}`}
              aria-hidden={!isOpen}
              className={cn('accordion-content-panel', isOpen ? 'open' : 'closed')}
            >
              <div className="accordion-content-inner" aria-hidden={!isOpen}>
                {typeof bodyContent === 'string' ? (
                  <p className="accordion-answer-text">{bodyContent}</p>
                ) : (
                  bodyContent
                )}
              </div>
            </div>

            <div className="accordion-bottom-divider">
              <div className={cn('accordion-divider-fill', isOpen && 'is-active')} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AnimatedAccordion;
