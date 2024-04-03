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
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { text } from './ui/text'
import { Button } from './ui/button'
import { ComponentProps, useEffect, useState } from 'react'
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
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { FilterIcon } from 'lucide-react'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
} & ComponentProps<'div'> & {
    pageSize?: number
    filter?: Array<{
      filterColumn: string
      filterPlaceHolder: string
      filterValues?: Array<string>
    }>
  }

function Filters({
  table,
  filter,
}: {
  table: any
  filter: Array<{
    filterColumn: string
    filterPlaceHolder: string
    filterValues?: Array<string>
  }>
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:flex-wrap sm:mb-4">
      {filter.map(({ filterColumn, filterPlaceHolder, filterValues }, index) =>
        !filterValues ? (
          <div className="flex items-center" key={index}>
            {filter && (
              <Input
                placeholder={filterPlaceHolder}
                value={
                  (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                  ''
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )}
          </div>
        ) : (
          <div className="max-w-sm">
            <Select
              onValueChange={table.getColumn(filterColumn)?.setFilterValue}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                ''
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
        ),
      )}
      <Button variant={'secondary'} onClick={() => table.resetColumnFilters()}>
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
  ...props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    if (pageSize) table.setPageSize(pageSize as number)
  }, [])

  return (
    <div {...props}>
      {filter && (
        <div className="flex justify-end sm:hidden mb-4">
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
        <div className="hidden  sm:flex sm:justify-end">
          <Filters table={table} filter={filter} />
        </div>
      )}

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
