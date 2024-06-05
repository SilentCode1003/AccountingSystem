import { ColumnDef } from '@tanstack/table-core'
import { LiquidationRoutes } from './liquidationRoutes.columns'
import { Routes } from './routes.columns'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import { RouteDiscrepanciesStatusColumn } from '../table-components/routeDiscrepancies.tblcomp'
import { cn } from '@/lib/utils'

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
    accessorKey: 'startPoint',
    accessorFn: ({ route, liquidationRoute }) =>
      route.routeStart ?? liquidationRoute.lrFrom ?? '',
    meta: 'Start Point',
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
          Start Point
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'endPoint',
    accessorFn: ({ route, liquidationRoute }) =>
      route.routeEnd ?? liquidationRoute.lrTo ?? '',
    meta: 'End Point',
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
          End Point
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'modeOfTransport',
    accessorFn: ({ route, liquidationRoute }) =>
      route.routeModeOfTransport ?? liquidationRoute.lrModeOfTransport ?? '',
    meta: 'Mode of Transport',
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
          Mode of Transport
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

export const RouteDiscrepancyCardColumns: ColumnDef<{
  startPoint: string
  endPoint: string
  price: number
  modeOfTransport: string
  gtr: boolean
}>[] = [
  {
    accessorKey: 'startPoint',
    header: () => 'Start Point',
  },
  {
    accessorKey: 'endPoint',
    header: () => 'End Point',
  },
  {
    accessorKey: 'price',
    header: () => 'Price',
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.price))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return (
        <div
          className={cn(row.original.gtr ? 'text-green-500' : 'text-red-500')}
        >
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'modeOfTransport',
    header: () => 'Mode of Transport',
  },
]
