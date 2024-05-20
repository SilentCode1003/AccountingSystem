import DataTable from '@/components/DataTable'
import { Dropzone } from '@/components/Dropzone'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import {
  useCreateEmployee,
  useSyncEmployeeByAPI,
  useSyncEmployeeByFile,
} from '@/hooks/mutations'
import { useEmployees } from '@/hooks/queries'
import { employeesOptions } from '@/hooks/queries/options'
import { createEmployeeSchema } from '@/validators/employees.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { CircleUserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/employees',
)({
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

const SyncEmployees = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [employeeApi, setEmployeeApi] = useState<string>('')
  const [syncType, setSyncType] = useState<string>('api')

  const syncEmployeesByApi = useSyncEmployeeByAPI({ setOpen })

  const syncEmployeeByFile = useSyncEmployeeByFile({ setOpen })

  const handleSubmit = () => {
    if (syncType === 'api' && employeeApi && employeeApi !== '') {
      syncEmployeesByApi.mutate({ employeeApi })
    }
    if (syncType === 'xlsx' && file) {
      const payload = new FormData()

      payload.append('file', file as File)

      syncEmployeeByFile.mutate(payload)
    }
    setEmployeeApi('')
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Sync Employees</Button>
      <AlertDialogContent className="scale-75 sm:scale-100">
        <AlertDialogHeader>
          <div className="flex justify-between items-center">
            <Text variant={'heading3bold'}>Sync Employees</Text>
            <Select value={syncType} onValueChange={setSyncType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sync Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="xlsx">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AlertDialogHeader>
        {syncType === 'api' ? (
          <Input
            value={employeeApi}
            className="w-full"
            placeholder='eg. "http://172.16.2.200:3005/employee/load"'
            onChange={(e) => setEmployeeApi(e.target.value)}
          />
        ) : (
          <Dropzone onChange={setFile} fileExtension="xlsx" />
        )}

        <Button onClick={handleSubmit}> Sync </Button>
      </AlertDialogContent>
    </AlertDialog>
  )
}
const CrudComponents = () => {
  const [open, setOpen] = useState<boolean>(false)
  const createEmployee = useCreateEmployee({ setOpen })

  const form = useForm<z.infer<typeof createEmployeeSchema>>({
    defaultValues: {
      empName: '',
      empEmail: '',
      empSalary: 0,
      empContactInfo: '',
      empDepartment: '',
      empPosition: '',
      empJobStatus: '',
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
        <div className="flex gap-4">
          <Button className="flex gap-2" onClick={() => setOpen(true)}>
            Add Employee <CircleUserIcon />
          </Button>
          <SyncEmployees />
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee ID</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee ID"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                  name="empPosition"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Position</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Position"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empJobStatus"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Job Status</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Job Status"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Employee Department</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Employee Department"
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
    <div className="w-full">
      {employees.isSuccess && (
        <DataTable
          showVisibility
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
