import { ComboBox } from '@/components/Combobox'
import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import {
  payrollColumns,
  type Payrolls,
} from '@/components/table-columns/payrolls.columns'
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
import { useCreatePayroll } from '@/hooks/mutations'
import { useEmployees, usePayrolls } from '@/hooks/queries'
import { employeesOptions, payrollsOptions } from '@/hooks/queries/options'
import { createPayrollSchema } from '@/validators/payrolls.validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { HandCoinsIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/_layout/payrolls/')({
  loader: async ({ context }) => {
    const payrolls =
      await context.queryClient.ensureQueryData(payrollsOptions())
    const employees =
      await context.queryClient.ensureQueryData(employeesOptions())
    return { payrolls, employees }
  },
  component: Payrolls,
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
  const employees = useEmployees()
  const createPayroll = useCreatePayroll({ setOpen })

  const form = useForm<z.infer<typeof createPayrollSchema>>({
    defaultValues: {
      prEmployeeId: '',
      prTotalDeduction: 0,
    },
    resolver: zodResolver(createPayrollSchema),
  })

  const handleSubmit = (values: z.infer<typeof createPayrollSchema>) => {
    const fd = new FormData()

    Object.keys(values).forEach((key) => {
      fd.append(key, values[key as keyof typeof values] as any)
    })
    createPayroll.mutate(fd)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Payrolls</Text>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Payroll <HandCoinsIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <Text variant={'heading3bold'}>Create Payroll</Text>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
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
                            data={employees.data.employees.map((employee) => ({
                              value: employee.empId,
                              label: employee.empName,
                            }))}
                            emptyLabel="Nothing Selected"
                            value={field.value}
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
                          placeholder="Total Deduction"
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
                            console.log(e.target.files[0])
                            field.onChange(e.target.files[0])
                          }}
                          type="file"
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
              prompType="ADD"
              dialogTitle="You are about to create a new payroll"
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

function Payrolls() {
  const payrolls = usePayrolls()
  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {payrolls.isSuccess && (
        <DataTable
          showVisibility
          CrudComponents={CrudComponents}
          className="w-full md:w-[70vw]"
          columns={payrollColumns}
          data={payrolls.data.payrolls}
          filter={[
            {
              filterColumn: 'prEmpName',
              filterPlaceHolder: 'Filter employee name',
            },
            {
              filterColumn: 'prFinalAmount',
              filterPlaceHolder: 'Filter total amount',
            },
            {
              filterColumn: 'prDateFrom',
              filterPlaceHolder: 'Filter Date From',
              date: true,
            },
            {
              filterColumn: 'prDateTo',
              filterPlaceHolder: 'Filter Date To',
              date: true,
            },
          ]}
        />
      )}
    </div>
  )
}

export default Payrolls
