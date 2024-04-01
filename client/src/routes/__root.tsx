import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: {
    isLogged: boolean
    user?: {
      userId: string
      userType: string
    }
  }
}>()({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['CurrentUser'],
      queryFn: async () => {
        const response = await fetch('http://localhost:3000/login', {
          credentials: 'include',
        })

        if (!response.ok)
          return {
            isLogged: false,
          }

        const data = (await response.json()) as Promise<{
          isLogged: boolean
          user?: {
            userId: string
            userType: string
          }
        }>

        return data
      },
    })
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
