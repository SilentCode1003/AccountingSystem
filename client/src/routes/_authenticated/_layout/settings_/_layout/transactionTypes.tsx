import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import { TransactionTypeColumns } from '@/components/table-columns/transactionTypes.columns'
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
import { useCreateTransactionType } from '@/hooks/mutations'
import { useTransactionTypes } from '@/hooks/queries'
import { transactionTypesOptions } from '@/hooks/queries/options'
import { createTransactionTypeSchema } from '@/validators/transactionTypes.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRightLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/transactionTypes',
)({
  loader: async ({ context }) => {
    const transactionTypes = await context.queryClient.ensureQueryData(
      transactionTypesOptions(),
    )
    return { transactionTypes }
  },
  component: TransactionTypesComponent,
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

  const createTransactionType = useCreateTransactionType({ setOpen })

  const form = useForm<z.infer<typeof createTransactionTypeSchema>>({
    defaultValues: {
      tranTypeName: '',
    },
    resolver: zodResolver(createTransactionTypeSchema),
  })

  const handleSubmit = (
    values: z.infer<typeof createTransactionTypeSchema>,
  ) => {
    createTransactionType.mutate(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Transaction Types</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Transaction Type <ArrowRightLeftIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Transaction Type</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="tranTypeName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Transaction type Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Transaction type Name"
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
              dialogTitle="You are about to create a new transaction type"
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

function TransactionTypesComponent() {
  const transactionTypes = useTransactionTypes()

  return (
    <div className="w-full ">
      {transactionTypes.isSuccess && (
        <DataTable
          columns={TransactionTypeColumns}
          data={transactionTypes.data.transactionTypes}
          pageSize={10}
          showVisibility
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  )
}
