import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  Table as TableType,
  FilterFn,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { text } from './ui/text'
import { Button } from './ui/button'
import { ComponentProps, ElementType, useEffect, useState } from 'react'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ChevronDownIcon, FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import DatePicker from './ui/DatePicker'
import { Popover, PopoverContent } from './ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'

declare module '@tanstack/table-core' {
  interface FilterFns {
    dateBetweenFilter: FilterFn<unknown>
  }
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
} & ComponentProps<'div'> & {
    pageSize?: number
    filter?: Array<{
      filterColumn: string
      filterPlaceHolder?: string
      filterValues?: Array<string>
      date?: boolean
    }>
    CrudComponents?: ElementType
    showVisibility?: boolean
  }

const dateBetweenFilter: FilterFn<any> = (row, columnId, value) => {
  const date = new Date(row.getValue(columnId))
  const [start, end] = value

  if ((start || end) && !date) return false
  if (start && !end) {
    return date.getDate() >= start.getDate()
  } else if (!start && end) {
    return date.getDate() <= end.getDate()
  } else if (start && end) {
    return date.getDate() >= start.getDate() && date.getDate() <= end.getDate()
  } else return true
}

function Filters<TData>({
  table,
  filter,
}: {
  table: TableType<TData>
  filter: Array<{
    filterColumn: string
    filterPlaceHolder?: string
    filterValues?: Array<string>
    date?: boolean
    showVisibility?: boolean
  }>
}) {
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[repeat(2,minmax(200px,1fr))] sm:gap-4">
      {filter.map(
        ({ filterColumn, filterPlaceHolder, filterValues, date }, index) => {
          if (!date) {
            if (!filterValues) {
              return (
                <div className="flex items-center" key={index}>
                  {filter && (
                    <Input
                      placeholder={filterPlaceHolder}
                      value={
                        (table
                          .getColumn(filterColumn)
                          ?.getFilterValue() as string) ?? ''
                      }
                      onChange={(event) =>
                        table
                          .getColumn(filterColumn)
                          ?.setFilterValue(event.target.value)
                      }
                      className="w-full"
                    />
                  )}
                </div>
              )
            } else
              return (
                <div key={index} className="max-w-sm">
                  <Select
                    onValueChange={
                      table.getColumn(filterColumn)?.setFilterValue
                    }
                    value={
                      (table
                        .getColumn(filterColumn)
                        ?.getFilterValue() as string) ?? ''
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
          } else {
            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      text({ variant: 'label' }),
                      'w-full',
                      'justify-between',
                    )}
                  >
                    {filterPlaceHolder}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="space-y-2">
                  <DatePicker
                    triggerLabel="Start Date"
                    date={
                      (
                        table.getColumn(filterColumn)?.getFilterValue() as [
                          Date,
                          Date,
                        ]
                      )?.[0]
                    }
                    setDate={(e: Date) => {
                      if (!e) return
                      return table
                        .getColumn(filterColumn)
                        ?.setFilterValue((old: [Date, Date]) => [
                          new Date(e),
                          old?.[1],
                        ])
                    }}
                  />
                  <DatePicker
                    triggerLabel="End Date"
                    date={
                      (
                        table.getColumn(filterColumn)?.getFilterValue() as [
                          Date,
                          Date,
                        ]
                      )?.[1]
                    }
                    setDate={(e: Date) => {
                      if (!e) return
                      return table
                        .getColumn(filterColumn)
                        ?.setFilterValue((old: [Date, Date]) => [
                          old?.[0],
                          new Date(e),
                        ])
                    }}
                  />
                </PopoverContent>
              </Popover>
            )
          }
        },
      )}
      <Button
        className={cn(filter.length % 2 === 0 ? 'col-span-2' : '')}
        variant={'secondary'}
        onClick={() => table.resetColumnFilters()}
      >
        Clear Filters
      </Button>
    </div>
  )
}

function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  filter,
  CrudComponents,
  showVisibility,
  ...props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      dateBetweenFilter,
    },
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  useEffect(() => {
    if (pageSize) table.setPageSize(pageSize as number)
  }, [])

  return (
    <div {...props}>
      <div className="flex items-center justify-between mb-4">
        {CrudComponents ? (
          <div className="self-end">
            <CrudComponents />
          </div>
        ) : (
          <div />
        )}
        <div className={cn('flex gap-4', !showVisibility ? 'hidden' : '')}>
          <div className="self-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        <>{column.columnDef.meta}</>
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {filter && (
            <div className="flex justify-end lg:hidden ">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <FilterIcon size={32} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filters</DropdownMenuLabel>
                  <Filters table={table} filter={filter} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {filter && (
            <div className="hidden lg:flex lg:justify-end ">
              <Filters table={table} filter={filter} />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className={`${text({ variant: 'label' })}`}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={`${text({ variant: 'body' })}`}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className={`${text({ variant: 'label' })}`}>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => {
                  return (
                    <TableHead key={footer.id} className="bg-background">
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default DataTable
