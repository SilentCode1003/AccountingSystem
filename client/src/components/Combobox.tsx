'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CommandList } from 'cmdk'
import { ScrollArea } from './ui/scroll-area'

export function ComboBox({
  data,
  value,
  setValue,
  emptyLabel,
}: {
  data: Array<{
    value: string
    label: string
  }>
  value: string
  setValue: Function
  emptyLabel: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find((data) => {
                console.log(data.value)
                return data.value === value
              })?.label
            : 'Select data...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ScrollArea className="h-72 w-fit rounded-md border">
          <Command>
            <CommandInput placeholder="Search data..." className="h-9" />
            <CommandEmpty>{emptyLabel}.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data.map((data) => (
                  <CommandItem
                    key={data.value}
                    value={data.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    {data.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === data.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
