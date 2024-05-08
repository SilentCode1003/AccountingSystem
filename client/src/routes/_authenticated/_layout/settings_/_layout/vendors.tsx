import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import { vendorColumns } from '@/components/table-columns/vendors.columns'
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
import { useCreateVendor } from '@/hooks/mutations'
import { useVendors } from '@/hooks/queries'
import { vendorsOptions } from '@/hooks/queries/options'
import { createVendorSchema } from '@/validators/vendors.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { CircleUserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/vendors',
)({
  loader: async ({ context }) => {
    const vendors = await context.queryClient.ensureQueryData(vendorsOptions())
    return { vendors }
  },
  component: VendorsComponent,
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
  const createVendor = useCreateVendor({ setOpen })

  const form = useForm<z.infer<typeof createVendorSchema>>({
    defaultValues: {
      vdName: '',
      vdAddress: '',
      vdEmail: '',
      vdContactInfo: '',
    },
    resolver: zodResolver(createVendorSchema),
  })

  const handleSubmit = (values: z.infer<typeof createVendorSchema>) => {
    createVendor.mutate(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Vendors</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Vendor <CircleUserIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Vendor</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="vdName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Vendor Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Vendor Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vdAddress"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Vendor Address</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Vendor Address"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vdContactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Vendor Contact Info</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Vendor Contact Info"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vdEmail"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Vendor Email</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Vendor Email"
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
              dialogTitle="You are about to create a new vendor"
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

function VendorsComponent() {
  const vendors = useVendors()
  return (
    <div className="w-full">
      {vendors.isSuccess && (
        <DataTable
          showVisibility
          columns={vendorColumns}
          data={vendors.data.vendors}
          filter={[
            {
              filterColumn: 'vdName',
              filterPlaceHolder: 'Filter by name',
            },
            {
              filterColumn: 'vdSalary',
              filterPlaceHolder: 'Filter by Salary',
            },
            {
              filterColumn: 'vdDateTerminated',
              filterPlaceHolder: 'Filter Date Terminated',
              date: true,
            },
            {
              filterColumn: 'vdBirthdate',
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

export default VendorsComponent
