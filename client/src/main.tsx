import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './components/ui/theme.provider'
import { useCurrentUserSuspense } from './hooks/queries'
import './index.css'
import { routeTree } from './routeTree.gen'

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
  const currentUser = useCurrentUserSuspense()
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
