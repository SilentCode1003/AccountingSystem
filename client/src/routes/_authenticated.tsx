import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context: { auth, queryClient }, location }) => {
    await queryClient.ensureQueryData({
      queryKey: ['CurrentUser'],
      queryFn: async () => {
        console.log('test')
      },
    })
    const q = queryClient.getQueryData(['CurrentUser'])
    console.log(q)

    const data = await queryClient.fetchQuery({
      queryKey: ['CurrentUser'],
      queryFn: async () => {
        const response = await fetch('http://localhost:3000/login', {
          credentials: 'include',
        })

        console.log(response)
        return response.json() as Promise<{
          isLogged: boolean
          user: {
            userId: string
            userType: string
          }
        }>
      },
    })

    console.log(data)

    // console.log(auth)
    if (auth && !auth.isLogged) {
      console.log('test')
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
