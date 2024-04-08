import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: ['CurrentUser'],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/login`,
          {
            credentials: 'include',
          },
        )

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

    if (data && !data.isLogged) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
