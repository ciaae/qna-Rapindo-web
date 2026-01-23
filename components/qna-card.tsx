'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QnAItem {
  id: number
  question: string
  answer: string
  category: string
  tags: string[]
}

interface QnACardProps {
  item: QnAItem
  isExpanded: boolean
  onToggle: () => void
}

export function QnACard({ item, isExpanded, onToggle }: QnACardProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all duration-200 hover:border-accent hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {item.category}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">{item.question}</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="whitespace-pre-line text-sm text-foreground/80 leading-relaxed">
          {item.answer}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  )
}
