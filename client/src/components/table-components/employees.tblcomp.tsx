import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTerminateEmployee, useUpdateEmployee } from '@/hooks/mutations'
import { updateEmployeeSchema } from '@/validators/employees.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PromptModal } from '../PromptModal'
import { Employees } from '../table-columns/employees.columns'
import { AlertDialog } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import DatePicker from '../ui/DatePicker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/Form'
import { Input } from '../ui/input'
import { Text } from '../ui/text'

export const SalaryColumn = ({ row }: CellContext<Employees, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm({
    defaultValues: {
      empId: row.original.empId,
      newData: {
        empName: row.original.empName,
        empJobStatus: row.original.empJobStatus,
        empPosition: row.original.empPosition,
        empDepartment: row.original.empDepartment,
        empContactInfo: row.original.empContactInfo,
        empEmail: row.original.empEmail,
        empDateHired: new Date(row.original.empDateHired),
        empSalary: Number.parseFloat(String(row.original.empSalary)),
      },
    },
    resolver: zodResolver(updateEmployeeSchema),
  })

  const terminateEmployee = useTerminateEmployee()

  const updateEmployee = useUpdateEmployee({ setOpen })

  const handleSubmit = (values: z.infer<typeof updateEmployeeSchema>) => {
    updateEmployee.mutate(values)
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseFloat(row.getValue('empSalary')))

  return (
    <div className="flex justify-between items-center">
      <div>{formatted}</div>
      <div>
        <AlertDialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(row.original.empId)
                  }
                >
                  Copy Employee ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Employee</DropdownMenuItem>
                </DialogTrigger>
                {!row.original.empDateTerminated && (
                  <>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger>
                      <DropdownMenuItem>Terminate Employee</DropdownMenuItem>
                    </AlertDialogTrigger>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptModal
              callback={() =>
                terminateEmployee.mutate({ empId: row.original.empId })
              }
              nonButton
              dialogMessage="Continue?"
              prompType="TOGGLE"
              dialogTitle="You are about to terminate this employee"
              triggerText="TERMINATE EMPLOYEE"
            />
            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Employee</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
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
                                <Input disabled className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.empName"
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
                          name="newData.empPosition"
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
                          name="newData.empJobStatus"
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
                          name="newData.empDepartment"
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
                          name="newData.empContactInfo"
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
                          name="newData.empEmail"
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
                          name="newData.empSalary"
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
                                  value={
                                    Number.isNaN(field.value)
                                      ? ''
                                      : Number.parseFloat(String(field.value))
                                  }
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
                          name="newData.empDateHired"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Employee Date Hired</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <DatePicker
                                  date={new Date(field.value)}
                                  setDate={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
                <div className="flex justify-between">
                  <PromptModal
                    dialogMessage="Continue?"
                    prompType="UPDATE"
                    dialogTitle="You are about to update this employee"
                    triggerText="Update"
                    callback={form.handleSubmit(handleSubmit)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant={'secondary'}
                      onClick={() => {
                        form.clearErrors()
                        form.reset()
                      }}
                    >
                      Clear
                    </Button>
                    <DialogClose asChild>
                      <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDialog>
      </div>
    </div>
  )
}

export const DateTerminatedColumn = ({
  row,
}: CellContext<Employees, unknown>) => {
  return (
    row.original.empDateTerminated && (
      <div>{new Date(row.original.empDateTerminated).toLocaleDateString()}</div>
    )
  )
}

export const DateHiredColumn = ({ row }: CellContext<Employees, unknown>) => {
  return new Date(row.original.empDateHired).toLocaleDateString()
}

// export const BirthdateColumn = ({ row }: CellContext<Employees, unknown>) => {
//   return new Date(row.original.empBirthdate).toLocaleDateString()
// }

// export const AddressColumn = ({ row }: CellContext<Employees, unknown>) => (
//   <div>
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <div className="line-clamp-2 max-w-60 text-left">
//             {row.original.empAddress}
//           </div>
//         </TooltipTrigger>
//         <TooltipContent>{row.original.empAddress}</TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   </div>
// )

export const NameColumn = ({ row }: CellContext<Employees, unknown>) => {
  const names = row.original.empName.split(' ')

  return (
    <div className="flex gap-4 min-w-32 items-center">
      <div>
        <Avatar>
          <AvatarImage src={row.original.empImage} />
          <AvatarFallback>{names[0][0] + names[1][0]}</AvatarFallback>
        </Avatar>
      </div>
      <div>{row.original.empName}</div>
    </div>
  )
}
