import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Employees } from '../table-columns/employees.columns'
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
import { Button } from '../ui/button'
import { MoreHorizontal, ShieldXIcon } from 'lucide-react'
import { Text } from '../ui/text'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/Form'
import { Input } from '../ui/input'
import DatePicker from '../ui/DatePicker'
import { CellContext } from '@tanstack/react-table'
import {
  terminateEmployeeSchema,
  updateEmployeeSchema,
} from '@/validators/employees.validator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const SalaryColumn = ({ row }: CellContext<Employees, unknown>) => {
  const form = useForm({
    defaultValues: {
      empId: row.original.empId,
      newData: {
        empName: row.original.empName,
        empAddress: row.original.empAddress,
        empContactInfo: row.original.empContactInfo,
        empEmail: row.original.empEmail,
        empBirthdate: new Date(row.original.empBirthdate),
        empDateHired: new Date(row.original.empDateHired),
        empSalary: row.original.empSalary,
      },
    },
    resolver: zodResolver(updateEmployeeSchema),
  })
  const queryClient = useQueryClient()

  const terminateEmployee = useMutation({
    mutationKey: ['terminateEmployee'],
    mutationFn: async (payload: z.infer<typeof terminateEmployeeSchema>) => {
      const response = await fetch(
        `http://localhost:3000/employees/${payload.empId}`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
        },
      )
      const data = (await response.json()) as Promise<{
        employee: Employees
      }>
      return data
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['Employees'],
      })
    },
  })

  const updateEmployee = useMutation({
    mutationKey: ['updateEmployee'],
    mutationFn: async (payload: z.infer<typeof updateEmployeeSchema>) => {
      const response = await fetch('http://localhost:3000/employees', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      const data = (await response.json()) as Promise<{
        employee: Employees
      }>
      return data
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['Employees'],
      })
    },
  })

  const handleSubmit = (values: z.infer<typeof updateEmployeeSchema>) => {
    updateEmployee.mutate(values)
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseFloat(row.getValue('empSalary')))

  return (
    <div className="flex justify-between">
      <div>{formatted}</div>
      <div>
        <Dialog>
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
                  <DropdownMenuItem
                    onClick={() =>
                      terminateEmployee.mutate({
                        empId: row.original.empId,
                      })
                    }
                    className="flex justify-between"
                  >
                    Terminate Employee <ShieldXIcon />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="scale-75 md:scale-100">
            <DialogHeader>
              <DialogTitle>
                <Text variant="heading3bold">Update Employee</Text>
              </DialogTitle>
            </DialogHeader>
            <div>
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
                        name="newData.empAddress"
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
                                  Number.isNaN(parseFloat(String(field.value)))
                                    ? 0
                                    : parseFloat(String(field.value))
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    Number.isNaN(
                                      parseFloat(String(e.target.value)),
                                    )
                                      ? 0
                                      : e.target.value,
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newData.empBirthdate"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Employee Birthdate</FormLabel>
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

                    <div className="flex justify-between">
                      <DialogClose asChild>
                        <Button type="submit">Update</Button>
                      </DialogClose>
                      <div className="flex gap-2">
                        <Button
                          variant={'secondary'}
                          onClick={() => form.reset()}
                        >
                          Clear
                        </Button>
                        <DialogClose asChild>
                          <Button variant={'outline'}>Cancel</Button>
                        </DialogClose>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
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

export const BirthdateColumn = ({ row }: CellContext<Employees, unknown>) => {
  return new Date(row.original.empBirthdate).toLocaleDateString()
}

export const AddressColumn = ({ row }: CellContext<Employees, unknown>) => (
  <div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="line-clamp-2 max-w-60 text-left">
            {row.original.empAddress}
          </div>
        </TooltipTrigger>
        <TooltipContent>{row.original.empAddress}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)

export const NameColumn = ({ row }: CellContext<Employees, unknown>) => {
  return (
    <div className="flex gap-4 min-w-32 items-center">
      <div>
        <Avatar>
          <AvatarImage src={row.original.empImage} />
          <AvatarFallback>NG</AvatarFallback>
        </Avatar>
      </div>
      <div>{row.original.empName}</div>
    </div>
  )
}
