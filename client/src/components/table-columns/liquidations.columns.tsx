import { ColumnDef } from '@tanstack/table-core'
import { ArrowUpDownIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Employees } from './employees.columns'
import { LiquidationRoutes } from './liquidationRoutes.columns'

export type Liquidations = {
  liquidationId: string
  liquidationDate: Date
  liquidationEmpId: string
  liquidationAmount: number
  liquidationTranId: string
  liquidationRoutes: Array<LiquidationRoutes>
  employee: Employees
}

export const liquidationsColumns: ColumnDef<Liquidations>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      ) : (
        '🔵'
      )
    },
  },
  {
    accessorKey: 'liquidationDate',
    meta: 'Date',
    filterFn: 'dateBetweenFilter',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      new Date(row.original.liquidationDate).toLocaleDateString(),
  },
  {
    accessorKey: 'liquidationAmount',
    meta: 'Amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.liquidationAmount))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: 'liquidationEmpId',
    accessorFn: (row) => row.employee.empName,
    meta: 'Employee',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Employee
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    // cell: InventoryEntryTypeColumn,
  },
]
