import DataTable from '@/components/DataTable'
import {
  chequeColumns,
  type Cheques,
} from '@/components/table-columns/cheques.columns'
import {
  AlertDialog,
  AlertDialogAction,
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
import { createChequeSchema } from '@/validators/cheques.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ReceiptIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/_layout/cheques/')({
  component: Cheques,
})

const CrudComponents = () => {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const createCheque = useMutation({
    mutationFn: async (payload: z.infer<typeof createChequeSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json()
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(
        ['Cheques'],
        (old: { cheques: Array<Cheques> }) => {
          return { cheques: [...old.cheques, data.cheque] }
        },
      )
    },
  })

  const form = useForm<z.infer<typeof createChequeSchema>>({
    defaultValues: {
      chqAccType: 'EXPENSE',
      chqAmount: 0,
      chqPayeeName: '',
      chqStatus: 'PENDING',
    },
    resolver: zodResolver(createChequeSchema),
  })

  const handleSubmit = (values: z.infer<typeof createChequeSchema>) => {
    createCheque.mutate(values)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button className="flex gap-2" onClick={() => setOpen(true)}>
        Add Cheque <ReceiptIcon />
      </Button>
      <AlertDialogContent className="scale-75 sm:scale-100">
        <AlertDialogHeader>
          <Text variant={'heading3bold'}>Create Cheque</Text>
        </AlertDialogHeader>
        <Form {...form}>
          <form>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="chqPayeeName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Payee Name</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Payee Name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chqAmount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Cheque Amount</FormLabel>
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
                name="chqStatus"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Status</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="APPROVED">APPROVED</SelectItem>
                          <SelectItem value="REJECTED">REJECTED</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chqAccType"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Account Type</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EXPENSE">Expense</SelectItem>
                          <SelectItem value="REVENUE">Revenue</SelectItem>
                          <SelectItem value="SALARY">Salary</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chqIssueDate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Issue Date</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <div className="flex justify-between">
          <AlertDialogAction asChild>
            <Button onClick={form.handleSubmit(handleSubmit)} type="submit">
              Create
            </Button>
          </AlertDialogAction>
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
  )
}

function Cheques() {
  const cheques = useQuery({
    queryKey: ['Cheques'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques`,
        {
          credentials: 'include',
        },
      )

      const data = (await response.json()) as Promise<{
        cheques: Array<Cheques>
      }>

      return data
    },
  })

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {cheques.isSuccess && (
        <DataTable
          CrudComponents={CrudComponents}
          className="w-full md:w-[70vw]"
          columns={chequeColumns}
          data={cheques.data.cheques}
          filter={[
            {
              filterColumn: 'chqIssueDate',
              filterPlaceHolder: 'Filter Issue Date',
              date: true,
            },
            {
              filterColumn: 'chqAmount',
              filterPlaceHolder: 'Filter Amount',
            },
            {
              filterColumn: 'chqPayeeName',
              filterPlaceHolder: 'Filter by payee name',
            },
            {
              filterColumn: 'chqStatus',
              filterPlaceHolder: 'Filter by status',
              filterValues: ['PENDING', 'APPROVED', 'REJECTED'],
            },
          ]}
        />
      )}
    </div>
  )
}

export default Cheques
