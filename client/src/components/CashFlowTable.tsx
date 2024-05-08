import {
  ColumnDef,
  ExpandedState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table'
import { ComponentProps, useEffect, useState } from 'react'
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

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
} & ComponentProps<'div'> & {
    pageSize?: number

    showVisibility?: boolean
    showFooter?: boolean
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
function CashFlowTable<TData, TValue>({
  columns,
  data,
  pageSize,
  showVisibility,
  showFooter,
  ...props
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>(true)
  const [grouping, setGrouping] = useState<GroupingState>([])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      dateBetweenFilter,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => {
      const info = row as TData & {
        cfSubCategory?: any[]
        subCatSubCategory?: any[]
      }
      return info.cfSubCategory ?? info.subCatSubCategory
    },
    onGroupingChange: setGrouping,
    getGroupedRowModel: getCoreRowModel(),

    enableExpanding: true,
    state: {
      grouping,
      expanded,
    },
  })

  useEffect(() => {
    if (pageSize) table.setPageSize(pageSize as number)
  }, [])

  return (
    <div {...props}>
      <div className="rounded-md border">
        <Table>
          <TableHeader className={`${text({ variant: 'label' })}`}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
          {showFooter && (
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
          )}
        </Table>
      </div>
    </div>
  )
}

export default CashFlowTable
