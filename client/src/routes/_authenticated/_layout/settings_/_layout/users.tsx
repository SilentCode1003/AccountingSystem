import { ComboBox } from '@/components/Combobox'
import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import { usersColumns } from '@/components/table-columns/users.columns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { useCreateUser } from '@/hooks/mutations'
import { useEmployees, useUsers } from '@/hooks/queries'
import { employeesOptions } from '@/hooks/queries/options'
import { createUserSchema } from '@/validators/users.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { CircleUserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/users',
)({
  loader: async ({ context }) => {
    const employees =
      await context.queryClient.ensureQueryData(employeesOptions())
    return { employees }
  },
  component: UsersComponent,
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
  const createUser = useCreateUser({ setOpen })

  const employees = useEmployees()

  const form = useForm<z.infer<typeof createUserSchema>>({
    defaultValues: {
      empId: '',
    },
    resolver: zodResolver(createUserSchema),
  })

  const handleSubmit = (values: z.infer<typeof createUserSchema>) => {
    createUser.mutate(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Users</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-4">
          <Button className="flex gap-2" onClick={() => setOpen(true)}>
            Add User <CircleUserIcon />
          </Button>
        </div>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Employee</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="empId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <FormControl>
                        {employees.isSuccess && (
                          <ComboBox
                            data={employees.data.employees.map((t) => ({
                              label: t.empName,
                              value: t.empId,
                            }))}
                            emptyLabel="Nothing Found"
                            value={field.value as string}
                            setValue={field.onChange}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>User Type</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="User Type" />
                          </SelectTrigger>
                          <SelectContent className="flex-1">
                            <SelectItem value="FINANCE">FINANCE</SelectItem>
                            <SelectItem value="HIGHER_DEPARTMENT">
                              HIGHER DEPARTMENT
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
              dialogTitle="You are about to create a new employee"
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

function UsersComponent() {
  const users = useUsers()
  return (
    <div className="w-full">
      {users.isSuccess && (
        <DataTable
          showVisibility
          columns={usersColumns}
          data={users.data.users}
          filter={[
            {
              filterColumn: 'userFullName',
              filterPlaceHolder: 'Filter by name',
            },
            {
              filterColumn: 'userIsActive',
              filterPlaceHolder: 'Filter by status',
            },
            {
              filterColumn: 'userContactNumber',
              filterPlaceHolder: 'Filter Contact Number',
            },
          ]}
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  )
}

export default UsersComponent
