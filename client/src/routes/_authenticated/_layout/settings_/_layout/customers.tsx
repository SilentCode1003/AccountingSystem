import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import { customerColumns } from '@/components/table-columns/customers.columns'
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
import { useCreateCustomer } from '@/hooks/mutations'
import { useCustomers } from '@/hooks/queries'
import { customersOptions } from '@/hooks/queries/options'
import { createCustomerSchema } from '@/validators/customers.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { CircleUserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/customers',
)({
  loader: async ({ context }) => {
    const customers =
      await context.queryClient.ensureQueryData(customersOptions())
    return { customers }
  },
  component: CustomersComponent,
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
  const createCustomer = useCreateCustomer({ setOpen })

  const form = useForm<z.infer<typeof createCustomerSchema>>({
    defaultValues: {
      custName: '',
      custAddress: '',
      custEmail: '',
      custContactInfo: '',
    },
    resolver: zodResolver(createCustomerSchema),
  })

  const handleSubmit = (values: z.infer<typeof createCustomerSchema>) => {
    createCustomer.mutate(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Customers</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Customer <CircleUserIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Customer</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="custName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Customer Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Customer Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="custAddress"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Customer Address</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Customer Address"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="custContactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Customer Contact Info</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Customer Contact Info"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="custEmail"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Customer Email</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Customer Email"
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
              dialogTitle="You are about to create a new customer"
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

function CustomersComponent() {
  const customers = useCustomers()
  return (
    <div className="w-full">
      {customers.isSuccess && (
        <DataTable
          showVisibility
          columns={customerColumns}
          data={customers.data.customers}
          filter={[
            {
              filterColumn: 'custName',
              filterPlaceHolder: 'Filter by name',
            },
            {
              filterColumn: 'custSalary',
              filterPlaceHolder: 'Filter by Salary',
            },
            {
              filterColumn: 'custDateTerminated',
              filterPlaceHolder: 'Filter Date Terminated',
              date: true,
            },
            {
              filterColumn: 'custBirthdate',
              filterPlaceHolder: 'Filter birthdate',
              date: true,
            },
          ]}
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  )
}

export default CustomersComponent
