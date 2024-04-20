import { accountTypesOptions } from '@/hooks/queries/options'
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
  loader: async ({ context }) => {
    const accountTypes = context.queryClient.ensureQueryData(
      accountTypesOptions(),
    )

    return {
      accountTypes,
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}
