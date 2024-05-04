import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import {
  employeeColumns,
  type Employees,
} from '@/components/table-columns/employees.columns'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/ui/DatePicker'
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
import { useCreateEmployee } from '@/hooks/mutations'
import { useEmployees } from '@/hooks/queries'
import { employeesOptions } from '@/hooks/queries/options'
import { createEmployeeSchema } from '@/validators/employees.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { CircleUserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/_layout/employees/')({
  loader: async ({ context }) => {
    const employees =
      await context.queryClient.ensureQueryData(employeesOptions())
    return { employees }
  },
  component: Employees,
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
  const createEmployee = useCreateEmployee({ setOpen })

  const form = useForm<z.infer<typeof createEmployeeSchema>>({
    defaultValues: {
      empName: '',
      empAddress: '',
      empEmail: '',
      empSalary: 0,
      empContactInfo: '',
    },
    resolver: zodResolver(createEmployeeSchema),
  })

  const handleSubmit = (values: z.infer<typeof createEmployeeSchema>) => {
    createEmployee.mutate(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Employees</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Employee <CircleUserIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Employee</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="empName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empAddress"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Address</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Address"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empContactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Contact Info</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Contact Info"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empEmail"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Email</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empSalary"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Salary</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="number"
                          placeholder="Amount"
                          step="0.01"
                          {...field}
                          value={Number.isNaN(field.value) ? '' : field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empBirthdate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Birthdate</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empDateHired"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Date Hired</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
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

function Employees() {
  const employees = useEmployees()
  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {employees.isSuccess && (
        <DataTable
          showVisibility
          className="w-full md:w-[70vw]"
          columns={employeeColumns}
          data={employees.data.employees}
          filter={[
            {
              filterColumn: 'empName',
              filterPlaceHolder: 'Filter by name',
            },
            {
              filterColumn: 'empSalary',
              filterPlaceHolder: 'Filter by Salary',
            },
            {
              filterColumn: 'empDateTerminated',
              filterPlaceHolder: 'Filter Date Terminated',
              date: true,
            },
            {
              filterColumn: 'empBirthdate',
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

export default Employees
