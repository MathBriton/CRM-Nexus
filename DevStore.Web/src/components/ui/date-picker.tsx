import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  fromDate?: Date
  toDate?: Date
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Selecionar',
  fromDate,
  toDate,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'inline-flex h-9 w-36 items-center justify-start gap-2 rounded-md border border-input bg-transparent px-3 text-sm font-normal shadow-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          !value && 'text-muted-foreground',
          className,
        )}
      >
        <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">
          {value ? format(value, 'dd/MM/yyyy', { locale: ptBR }) : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          fromDate={fromDate}
          toDate={toDate}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
