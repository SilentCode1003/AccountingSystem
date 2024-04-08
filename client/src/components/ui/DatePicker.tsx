'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { text } from './text'

export function DatePicker({
  date,
  setDate,
  triggerLabel,
}: {
  date?: Date
  setDate: Function
  triggerLabel?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            text({ variant: 'body' }),
            'justify-start text-left font-normal w-full',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP')
          ) : (
            <span>{triggerLabel ? triggerLabel : 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={text({ variant: 'body', className: 'w-auto p-0' })}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => setDate(e)}
          initialFocus
          disabled={(date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
