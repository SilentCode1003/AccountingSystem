import { CellContext } from '@tanstack/react-table'
import { Payrolls } from '../table-columns/payrolls.columns'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { EyeOff, MoreHorizontal, MoreHorizontalIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import DatePicker from '../ui/DatePicker'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updatePayrollSchema } from '@/validators/payrolls.validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Employees } from '../table-columns/employees.columns'

export const EmployeeNameColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return (
    <div className="flex justify-between min-w-32 items-center">
      <div className="flex gap-4">
        <div>
          <Avatar>
            <AvatarImage src={'https://github.com/nestortion.png'} />
            <AvatarFallback>NG</AvatarFallback>
          </Avatar>
        </div>
        <div className="line-clamp-2">{row.original.employee.empName}</div>
      </div>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(row.original.employee.empId)
              }
            >
              Copy Employee ID
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem className="hover:cursor-pointer">
                View Employee Details
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="rounded-md w-fit sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{row.original.employee.empName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-0">
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                ID
              </Text>
              <div className="flex-1">{row.original.employee.empId}</div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Address
              </Text>
              <div className="flex-1">{row.original.employee.empAddress}</div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Contact Info
              </Text>
              <div className="flex-1">
                {row.original.employee.empContactInfo}
              </div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Email
              </Text>
              <div className="flex-1">{row.original.employee.empEmail}</div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Birthdate
              </Text>
              <div className="flex-1">
                {new Date(
                  row.original.employee.empBirthdate,
                ).toLocaleDateString()}
              </div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Date Hired
              </Text>
              <div className="flex-1">
                {new Date(
                  row.original.employee.empDateHired,
                ).toLocaleDateString()}
              </div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Date Terminated
              </Text>
              <div className="flex-1">
                {new Date(
                  row.original.employee.empDateTerminated,
                ).toLocaleDateString()}
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const DateFromColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return new Date(row.original.prDateFrom).toLocaleDateString()
}

export const DateToColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return new Date(row.original.prDateTo).toLocaleDateString()
}

export const TotalDeductionColumn = ({
  row,
}: CellContext<Payrolls, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseInt(row.getValue('prTotalDeduction')))

  return formatted
}

export const FinalAmountColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const employees = useQuery({
    queryKey: ['Employees'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/employees`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
        },
      )
      const data = (await response.json()) as Promise<{
        employees: Array<Employees>
      }>
      return data
    },
  })

  const form = useForm<z.infer<typeof updatePayrollSchema>>({
    defaultValues: {
      prId: row.original.prId,
      newData: {
        prTotalDeduction: Number(row.original.prTotalDeduction),
        prDateTo: new Date(row.original.prDateTo),
        prDateFrom: new Date(row.original.prDateFrom),
        prEmployeeId: row.original.employee.empId,
      },
    },
    resolver: zodResolver(updatePayrollSchema),
  })

  const queryClient = useQueryClient()

  const updateCheque = useMutation({
    mutationKey: ['updateCheque'],
    mutationFn: async (payload: z.infer<typeof updatePayrollSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/payrolls`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      const data = (await response.json()) as Promise<{
        payroll: Payrolls
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['Payrolls'],
        (old: { payrolls: Array<Payrolls> }) => {
          const newPayrolls = old.payrolls.map((payroll) => {
            if (payroll.prId === row.original.prId) {
              return data.payroll
            }
            return payroll
          })
          return { payrolls: newPayrolls }
        },
      )
      setIsOpen(false)
    },

    onError: (error) => {
      console.log(error)
    },
  })

  const handleSubmit = (values: z.infer<typeof updatePayrollSchema>) => {
    updateCheque.mutate(values)
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseInt(row.getValue('prFinalAmount')))

  return (
    <div className="flex justify-between">
      <div>{formatted}</div>
      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>Update Payroll</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-between">
                Hide <EyeOff />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="scale-75 md:scale-100">
            <DialogHeader>Update Inventory</DialogHeader>
            <div className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="prId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Payroll ID</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Input
                              disabled
                              className="w-full"
                              placeholder="Cheque ID"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newData.prEmployeeId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Employee</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={row.original.employee.empName}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {employees.isSuccess &&
                                  employees.data.employees.map((employee) => (
                                    <SelectItem
                                      key={employee.empId}
                                      value={employee.empId}
                                    >
                                      {employee.empName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newData.prTotalDeduction"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Total Deduction</FormLabel>
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
                                  : Number(field.value)
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
                      name="newData.prDateFrom"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Date From</FormLabel>
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
                      name="newData.prDateTo"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Date To</FormLabel>
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
                <DialogClose asChild>
                  <Button
                    onClick={form.handleSubmit(handleSubmit)}
                    type="submit"
                  >
                    Update
                  </Button>
                </DialogClose>
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
      </div>
    </div>
  )
}
