import { CellContext } from '@tanstack/react-table'
import { Payrolls } from '../table-columns/payrolls.columns'

import { useUpdatePayroll } from '@/hooks/mutations'
import { updatePayrollSchema } from '@/validators/payrolls.validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { EyeOff, MoreHorizontal, MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ComboBox } from '../Combobox'
import { PromptModal } from '../PromptModal'
import { Employees } from '../table-columns/employees.columns'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
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

export const EmployeeNameColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return (
    <div className="flex justify-between min-w-32 items-center">
      <div className="flex items-center gap-4">
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
        <DialogContent className="rounded-md max-w-fit sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{row.original.employee.empName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-2">
            <div className="flex flex-col sm:flex-row">
              <Text className="w-full sm:w-[33%]" variant={'body'}>
                Employee Name
              </Text>
              <Text variant={'label'} className="flex-1">
                {row.original.employee.empName}
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row">
              <Text className="w-full sm:w-[33%]" variant={'body'}>
                Contact Info
              </Text>
              <Text variant={'label'} className="flex-1">
                {row.original.employee.empContactInfo}
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row">
              <Text className="w-full sm:w-[33%]" variant={'body'}>
                Email
              </Text>
              <Text variant={'label'} className="flex-1">
                {row.original.employee.empEmail}
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row">
              <Text className="w-full sm:w-[33%]" variant={'body'}>
                Job Status
              </Text>
              <Text variant={'label'} className="flex-1">
                {row.original.employee.empJobStatus}
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row">
              <Text className="w-full sm:w-[33%]" variant={'body'}>
                Department
              </Text>
              <Text variant={'label'} className="flex-1">
                {row.original.employee.empDepartment}
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row">
              <Text className="w-full sm:w-[33%]" variant={'body'}>
                Position
              </Text>
              <Text variant={'label'} className="flex-1">
                {row.original.employee.empPosition}
              </Text>
            </div>
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
  }).format(row.getValue('prTotalDeduction'))

  return formatted
}

export const FinalAmountColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const employees = useQuery({
    queryKey: ['employees'],
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
      prTranId: row.original.prTranId,
      prTotalDeduction: Number.parseFloat(
        String(row.original.prTotalDeduction),
      ),
      prDateTo: new Date(row.original.prDateTo),
      prDateFrom: new Date(row.original.prDateFrom),
      prEmployeeId: row.original.employee.empId,
    },
    resolver: zodResolver(updatePayrollSchema),
  })

  const updateCheque = useUpdatePayroll({ cell: { row }, setIsOpen })
  const handleSubmit = (values: z.infer<typeof updatePayrollSchema>) => {
    const fd = new FormData()

    Object.keys(values).forEach((key) => {
      fd.append(key, values[key as keyof typeof values] as any)
    })
    updateCheque.mutate(values)
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.getValue('prFinalAmount'))

  return (
    <div className="flex justify-between items-center">
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
                      name="prEmployeeId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Employee</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            {employees.isSuccess && (
                              <ComboBox
                                data={employees.data.employees.map(
                                  (employee) => ({
                                    value: employee.empId,
                                    label: employee.empName,
                                  }),
                                )}
                                emptyLabel="Nothing Selected"
                                value={field.value as string}
                                setValue={field.onChange}
                              />
                            )}
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prTotalDeduction"
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
                      name="prFile"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Supporting File</FormLabel>
                          <FormControl>
                            <Input
                              ref={field.ref}
                              onBlur={field.onBlur}
                              onChange={(e: any) => {
                                if (!e.target.files) return

                                if (!e.target.files[0]) return
                                field.onChange(e.target.files[0])
                              }}
                              type="file"
                              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .pdf"
                              className="w-full hover:cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prDateFrom"
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
                      name="prDateTo"
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
                <PromptModal
                  dialogMessage="Continue?"
                  prompType="UPDATE"
                  dialogTitle="You are about to update this payroll"
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
      </div>
    </div>
  )
}
