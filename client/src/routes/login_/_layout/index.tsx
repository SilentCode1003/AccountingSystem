import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { useLogin } from '@/hooks/mutations'
import { currentUserOptions } from '@/hooks/queries/options'
import { loginSchema } from '@/validators/auth.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/login/_layout/')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const data = await queryClient.ensureQueryData(currentUserOptions())

    if (data && data.isLogged) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: login,
})

function login() {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const login = useLogin()

  const handleSubmit = (values: z.infer<typeof loginSchema>) => {
    login.mutate(values)
  }

  return (
    <div className=" h-[95vh] max-h-[95vh] flex flex-col gap-4 md:flex-row">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div>
          <img
            className="w-40 md:w-80"
            src="https://www.5lsolutions.com/wp-content/uploads/2023/03/FiveL-1.png"
          />
        </div>
        <Text variant={'heading1bold'}>Accounting System</Text>
      </div>
      <Separator orientation="horizontal" className="md:hidden" />
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="flex-1 flex items-center justify-center px-8 pb-8 md:pb-0">
        <div>
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Text variant={'heading1bold'} className="font-thin md:font-bold">
                Login
              </Text>
              <Text
                variant={'heading4ghost'}
                className="text-center md:text-start "
              >
                Enter your username and password to login!
              </Text>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="w-full">
                          <div className="w-full flex justify-between items-center">
                            <FormLabel>Username</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Input className="w-full" type="text" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="w-full">
                          <div className="w-full flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Sign in
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default login
