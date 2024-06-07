import { ColumnDef } from '@tanstack/table-core'
import { ArrowUpDownIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Employees } from './employees.columns'

export type Budgets = {
  budgetId: string
  budgetDate: Date
  budgetEmpId: string
  budgetAmount: number
  budgetTranId: string
  employee: Employees
}

export const budgetsColumns: ColumnDef<Budgets>[] = [
  {
    accessorKey: 'budgetDate',
    filterFn: 'dateBetweenFilter',
    meta: 'Date',
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
    cell: ({ row }) => new Date(row.original.budgetDate).toLocaleDateString(),
  },
  {
    accessorKey: 'budgetAmount',
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
      const amount = parseFloat(String(row.original.budgetAmount))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: 'budgetEmpId',
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
