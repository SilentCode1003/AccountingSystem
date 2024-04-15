import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { ThemeProvider } from './components/ui/theme.provider'
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
})

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    currentUser: undefined!,
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const AuthApp = () => {
  const currentUser = useSuspenseQuery({
    queryKey: ['CurrentUser'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
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
  return (
    <RouterProvider
      router={router}
      context={{ currentUser: currentUser.data }}
    />
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthApp />
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
