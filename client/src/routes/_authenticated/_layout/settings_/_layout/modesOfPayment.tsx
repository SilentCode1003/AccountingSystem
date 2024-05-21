import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import { ModesOfPaymentColumns } from '@/components/table-columns/modesOfPayment.columns'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
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
import { Text } from '@/components/ui/text'
import { useCreateModeOfPayment } from '@/hooks/mutations'
import { useModesOfPayment } from '@/hooks/queries'
import { modesOfPaymentOptions } from '@/hooks/queries/options'
import { createModeOfPaymentSchema } from '@/validators/modesOfPayment.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { BanknoteIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/modesOfPayment',
)({
  loader: async ({ context }) => {
    const modeOfPayment = await context.queryClient.ensureQueryData(
      modesOfPaymentOptions(),
    )
    return { modeOfPayment }
  },
  component: ModeOfPaymentComponent,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
    </div>
  )
}

const CrudComponents = () => {
  const [open, setOpen] = useState<boolean>(false)

  const createModeOfPayment = useCreateModeOfPayment({ setOpen })

  const form = useForm<z.infer<typeof createModeOfPaymentSchema>>({
    defaultValues: {
      mopName: '',
    },
    resolver: zodResolver(createModeOfPaymentSchema),
  })

  const handleSubmit = (values: z.infer<typeof createModeOfPaymentSchema>) => {
    createModeOfPayment.mutate(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Modes of Payment</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Mode of Payment
          <BanknoteIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Mode of Payment</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="mopName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Mode of Payment Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Mode of Payment Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <div className="flex justify-between">
            <PromptModal
              dialogMessage="Continue?"
              prompType="ADD"
              dialogTitle="You are about to create a new mode of Payment"
              triggerText="Create"
              callback={form.handleSubmit(handleSubmit)}
            />
            <div className="flex gap-2 ">
              <Button variant={'secondary'} onClick={() => form.clearErrors()}>
                Clear
              </Button>
              <AlertDialogCancel asChild>
                <Button variant={'outline'} className="mt-0">
                  Cancel
                </Button>
              </AlertDialogCancel>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ModeOfPaymentComponent() {
  const modesOfPayment = useModesOfPayment()

  return (
    <div className="w-full ">
      {modesOfPayment.isSuccess && (
        <DataTable
          columns={ModesOfPaymentColumns}
          data={modesOfPayment.data.modesOfPayment}
          pageSize={10}
          showVisibility
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  )
}
