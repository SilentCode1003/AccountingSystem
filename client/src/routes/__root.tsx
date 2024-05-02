import { Toaster } from '@/components/ui/toaster'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  currentUser: {
    isLogged: boolean
    user?: {
      userId: string
      userType: string
    }
  }
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
      {import.meta.env.VITE_NODE_ENV !== 'PROD' && <TanStackRouterDevtools />}
    </>
  )
}
