import { useToggleRouteDiscrepancy } from '@/hooks/mutations'
import { cn } from '@/lib/utils'
import { CellContext, Row } from '@tanstack/table-core'
import { MoreHorizontalIcon } from 'lucide-react'
import CleanTable from '../CleanTable'
import { PromptModal } from '../PromptModal'
import {
  RouteDiscrepancies,
  RouteDiscrepancyCardColumns,
} from '../table-columns/routeDiscrepancies.columns'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Text } from '../ui/text'

export const RouteDiscrepanciesStatusColumn = ({
  row,
}: CellContext<RouteDiscrepancies, unknown>) => {
  const toggleRouteDiscrepancy = useToggleRouteDiscrepancy()

  return (
    <div className="flex justify-between items-center">
      <Badge
        className={cn(
          row.original.rdIsResolved ? 'bg-emerald-500' : 'bg-rose-500',
          'hover:bg-gray-500 text-center',
        )}
      >
        {row.original.rdIsResolved ? 'Resolved' : 'Unresolved'}
      </Badge>
      <div>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.rdRouteId)
                }
              >
                Copy Route Discrepancy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  {row.original.rdIsResolved
                    ? 'Unresolve Route Discrepancy'
                    : 'Resolve Route Discrepancy'}
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <PromptModal
            callback={() =>
              toggleRouteDiscrepancy.mutate({
                routeId: row.original.rdId,
              })
            }
            nonButton
            dialogMessage="Continue?"
            prompType="UPDATE"
            dialogTitle={`You are about to ${row.original.rdIsResolved ? 'UNRESOLVE' : 'RESOLVE'} this account type! Data change may occur and cannot be undone!`}
            triggerText={row.original.rdIsResolved ? 'Unresolve' : 'Resolve'}
          />
        </AlertDialog>
      </div>
    </div>
  )
}

export const RouteDiscrepanciesSubComponent = ({
  row,
}: {
  row: Row<RouteDiscrepancies>
}) => {
  return (
    <div className="flex gap-4 p-4 ">
      <DiscrepancyCard
        title="Liquidation Route"
        data={{
          startPoint: row.original.liquidationRoute.lrFrom,
          endPoint: row.original.liquidationRoute.lrTo,
          price: row.original.liquidationRoute.lrPrice,
          modeOfTransport: row.original.liquidationRoute.lrModeOfTransport,
          gtr:
            row.original.liquidationRoute.lrPrice >
            row.original.route.routePrice,
        }}
        type="liquidationRoute"
        date={row.original.liquidationRoute.liquidation?.liquidationDate}
        empName={row.original.liquidationRoute.liquidation?.employee.empName}
      />
      <DiscrepancyCard
        title="Route"
        data={{
          startPoint: row.original.route.routeStart,
          endPoint: row.original.route.routeEnd,
          price: row.original.route.routePrice,
          modeOfTransport: row.original.route.routeModeOfTransport,
          gtr:
            row.original.liquidationRoute.lrPrice <
            row.original.route.routePrice,
        }}
        type="route"
      />
    </div>
  )
}

const DiscrepancyCard = ({
  title,
  data,
  type,
  date,
  empName,
}: {
  title: string
  data: {
    startPoint: string
    endPoint: string
    price: number
    modeOfTransport: string
    gtr: boolean
  }
  type: 'route' | 'liquidationRoute'
  date?: Date
  empName?: string
}) => {
  return (
    <Card className="w-full p-4">
      <Text variant={'heading1bold'}>{title}</Text>

      <CleanTable columns={RouteDiscrepancyCardColumns} data={[data]} />

      <Text variant={'heading1bold'} className="mt-4"></Text>
      {type === 'liquidationRoute' && (
        <>
          <div className="flex gap-4">
            <Text variant={'heading4bold'}>Date:</Text>
            <Text variant={'body'}>{new Date(date!).toLocaleDateString()}</Text>
          </div>
          <div className="flex gap-4">
            <Text variant={'heading4bold'}>Employee Name:</Text>
            <Text variant={'body'}>{empName}</Text>
          </div>
        </>
      )}
    </Card>
  )
}
