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
  CommandSeparator,
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
          className="w-full justify-between"
        >
          {value
            ? data.find((data) => {
                return data.value === value
              })?.label
            : 'Select One'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-72 w-full rounded-md border">
          <Command className="w-full">
            <CommandInput placeholder="Search" className="h-9" />
            <CommandEmpty>{emptyLabel}.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data.map((d) =>
                  d.value !== 'separator' ? (
                    <CommandItem
                      key={d.value}
                      value={d.label}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : d.value)
                        setOpen(false)
                      }}
                    >
                      {d.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === d.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ) : (
                    <CommandSeparator />
                  ),
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
