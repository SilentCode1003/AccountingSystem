import { Separator } from '@/components/ui/separator'
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
      <div className="w-full md:w-[70vw] flex gap-4 h-screen">
        <nav
          className={cn(
            'p-4  grid text-md text-muted-foreground w-[150px] h-fit',
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
              router.location.pathname === '/settings/reports' &&
                "font-semibold text-primary bg-muted relative before:absolute before:top-0 before:-left-4 before:content-[''] before:h-full before:w-2 before:bg-primary before:rounded-md transition-all duration-500",
              'px-4 py-2 rounded-md',
            )}
            to="/settings/reports"
          >
            Reports
          </Link>
        </nav>
        <Separator orientation="vertical" />
        <div className="p-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
