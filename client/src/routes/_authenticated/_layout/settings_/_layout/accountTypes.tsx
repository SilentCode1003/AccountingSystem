import DataTable from '@/components/DataTable'
import {
  accountTypeColumn,
  AccountTypes,
} from '@/components/table-columns/accountTypes.column'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { createAccountTypeSchema } from '@/validators/accountTypes.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ListPlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accountTypes',
)({
  component: AccountTypesComponent,
})

const CrudComponents = () => {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const createAccountType = useMutation({
    mutationFn: async (payload: z.infer<typeof createAccountTypeSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      const data = (await response.json()) as Promise<{
        accountType: AccountTypes
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['accountTypes'],
        (old: { accountTypes: Array<AccountTypes> }) => {
          return { accountTypes: [...old.accountTypes, data.accountType] }
        },
      )
      setOpen(false)
    },
  })

  const form = useForm<z.infer<typeof createAccountTypeSchema>>({
    defaultValues: {
      accTypeName: '',
      accTypeDefault: '',
    },
    resolver: zodResolver(createAccountTypeSchema),
  })

  const handleSubmit = (values: z.infer<typeof createAccountTypeSchema>) => {
    createAccountType.mutate(values)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button className="flex gap-2" onClick={() => setOpen(true)}>
        Add Account Type <ListPlusIcon />
      </Button>
      <AlertDialogContent className="scale-75 sm:scale-100">
        <AlertDialogHeader>
          <Text variant={'heading3bold'}>Create Account Type</Text>
        </AlertDialogHeader>
        <Form {...form}>
          <form>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="accTypeName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Account Type Name</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Account Type Name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accTypeDefault"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Account Type Default Statement</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Account type default" />
                        </SelectTrigger>
                        <SelectContent className="flex-1">
                          <SelectItem value="INCOMESTATEMENT">
                            Income Statement
                          </SelectItem>
                          <SelectItem value="BALANCESHEET">
                            Balance Sheet
                          </SelectItem>
                          <SelectItem value="CASHFLOW">Cash Flow</SelectItem>
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
          {/* <AlertDialogAction asChild> */}
          <Button
            onClick={() => form.handleSubmit(handleSubmit)()}
            type="submit"
          >
            Create
          </Button>
          {/* </AlertDialogAction> */}
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

function AccountTypesComponent() {
  const accountTypes = useQuery({
    queryKey: ['accountTypes'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes`,
        {
          credentials: 'include',
        },
      )
      const data = (await response.json()) as Promise<{
        accountTypes: Array<AccountTypes>
      }>

      return data
    },
  })

  return (
    <div>
      {accountTypes.isSuccess && (
        <DataTable
          columns={accountTypeColumn}
          data={accountTypes.data.accountTypes}
          pageSize={10}
          showVisibility
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  )
}
