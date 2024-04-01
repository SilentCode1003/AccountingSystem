import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { ThemeProvider } from './components/ui/theme.provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider, useAuth } from './auth/useUser'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
})

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!,
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const AuthApp = () => {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const App = () => {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
