import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout',
)({
  component: SettingsLayout,
})

function SettingsLayout() {
  const router = useRouterState()

  return (
    <div className="min-h-[85vh] flex flex-col items-center">
      <ScrollArea className="px-4 w-full">
        <div className="grid grid-cols-1 md:grid md:grid-cols-[200px,1fr] h-[85vh]">
          <nav
            className={cn(
              text({ variant: 'body' }),
              'p-4 flex flex-col text-md text-muted-foreground h-fit',
              'text-center md:text-start md:w-fit ',
            )}
          >
            <Link
              to="/settings"
              className={cn(
                router.location.pathname === '/settings' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
            >
              General
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/accounts' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/accounts"
            >
              Accounts
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/accountTypes' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/accountTypes"
            >
              Account types
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/transactionTypes' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/transactionTypes"
            >
              Transaction Types
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/modesOfPayment' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/modesOfPayment"
            >
              Modes of Payment
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/fieldRoutes' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/fieldRoutes"
            >
              Routes
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/employees' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/employees"
            >
              Employees
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/customers' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/customers"
            >
              Customers
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/vendors' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/vendors"
            >
              Vendors
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/inventory' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/inventory"
            >
              Inventory
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/users' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/users"
            >
              Users
            </Link>
            <Link
              className={cn(
                router.location.pathname === '/settings/reports' &&
                  "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
                'px-4 py-2 rounded-md',
              )}
              to="/settings/reports"
            >
              Reports
            </Link>
          </nav>
          <div className="p-4 w-full flex flex-col md:flex-row h-full gap-4">
            <Separator className="md:hidden" />
            <Separator className="hidden md:block" orientation="vertical" />
            <Outlet />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
