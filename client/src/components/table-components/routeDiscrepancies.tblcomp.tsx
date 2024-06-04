import { useToggleRouteDiscrepancy } from '@/hooks/mutations'
import { cn } from '@/lib/utils'
import { CellContext, Row } from '@tanstack/table-core'
import { MoreHorizontalIcon } from 'lucide-react'
import { PromptModal } from '../PromptModal'
import { RouteDiscrepancies } from '../table-columns/routeDiscrepancies.columns'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

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
    <>
      <div>{JSON.stringify(row.original.route)}</div>
      <div>{JSON.stringify(row.original.liquidationRoute)}</div>
    </>
  )
}
