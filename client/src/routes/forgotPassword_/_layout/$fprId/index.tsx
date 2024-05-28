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
import { useChangePassword } from '@/hooks/mutations'
import { forgetPasswordRequestOptions } from '@/hooks/queries/options'
import { changePasswordSchema } from '@/validators/auth.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/forgotPassword/_layout/$fprId/')({
  loader: async ({ params, context: { queryClient } }) => {
    const forgetPasswordRequest = await queryClient.ensureQueryData(
      forgetPasswordRequestOptions(params.fprId),
    )
    return {
      forgetPasswordRequest,
    }
  },
  component: forgetPasswordUserIdComponent,
})

function forgetPasswordUserIdComponent() {
  const loader = Route.useLoaderData()
  const [success, setSuccess] = useState<boolean>(false)
  const form = useForm({
    defaultValues: {
      userId: loader.forgetPasswordRequest.userId,
      newPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
  })

  const changePassword = useChangePassword({ setOpen: setSuccess })

  const handleSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    changePassword.mutate(values)
    setSuccess(true)
  }

  if (loader.forgetPasswordRequest.remarks === 'expired') {
    return <div>Request expired!</div>
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
                {!success
                  ? 'Set new password'
                  : 'Password Change Successfully!'}
              </Text>
              <Text
                variant={'heading4ghost'}
                className="max-w-96 text-center md:text-start "
              >
                You can now go back to the login page.
              </Text>
            </div>
            {!success ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="flex flex-col gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="newPassword"
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
                    Confirm
                  </Button>
                </form>
              </Form>
            ) : (
              <Button className="w-full mt-4">
                <Link to={'/login'}>Go Back</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default forgetPasswordUserIdComponent
