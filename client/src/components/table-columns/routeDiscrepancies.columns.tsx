import { ColumnDef } from '@tanstack/table-core'
import { LiquidationRoutes } from './liquidationRoutes.columns'
import { Routes } from './routes.columns'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import { RouteDiscrepanciesStatusColumn } from '../table-components/routeDiscrepancies.tblcomp'

export type RouteDiscrepancies = {
  rdId: string
  rdRouteId: string
  rdLrId: string
  rdIsResolved: boolean
  route: Routes
  liquidationRoute: LiquidationRoutes
}

export const routeDiscrepanciesColumns: ColumnDef<RouteDiscrepancies>[] = [
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
    accessorKey: 'rdId',
    accessorFn: (_, index) => index + 1,
    meta: 'ID',
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
          ID
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'rdIsResolved',
    accessorFn: ({ rdIsResolved }) =>
      rdIsResolved ? 'Resolved' : 'Unresolved',
    meta: 'Status',
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
          Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: RouteDiscrepanciesStatusColumn,
  },
]
