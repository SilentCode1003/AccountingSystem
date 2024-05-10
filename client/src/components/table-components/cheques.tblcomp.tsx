import { useUpdateCheque } from '@/hooks/mutations'
import { useAccountTypes } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import { chequeUpdateSchema } from '@/validators/cheques.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontal, MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ComboBox } from '../Combobox'
import { PromptModal } from '../PromptModal'
import { Cheques } from '../table-columns/cheques.columns'
import { Badge } from '../ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Text } from '../ui/text'

export const IssueDateColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return new Date(row.original.chqIssueDate).toLocaleDateString()
}

export const PayeeNameColumn = ({ row }: CellContext<Cheques, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.getValue('chqAmount'))

  return formatted
}

export const CreatedAtColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return new Date(row.original.chqCreatedAt).toLocaleDateString()
}

export const AccountColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return (
    <div className="flex justify-between items-center">
      <Badge variant={'outline'} className="text-nowrap">
        {row.original.transaction.account.accName}
      </Badge>
      <div>
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
                  navigator.clipboard.writeText(
                    row.original.transaction.account.accId,
                  )
                }
              >
                Copy Account ID
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="hover:cursor-pointer">
                  View Account Details
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="rounded-md w-fit sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Account Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Account ID
                </Text>
                <Text variant={'label'} className="flex-1">
                  {row.original.transaction.account.accId}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Account Type
                </Text>
                <Badge variant={'secondary'}>
                  {row.original.transaction.account.accountType.accTypeName}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Description
                </Text>
                <Text variant={'label'} className="flex-1">
                  {row.original.transaction.account.accDescription}
                </Text>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export const ChequeStatusColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return (
    <Badge
      className={cn(
        [
          row.original.chqStatus === 'PENDING' && 'bg-yellow-500',
          row.original.chqStatus === 'APPROVED' && 'bg-emerald-500',
          row.original.chqStatus === 'REJECTED' && 'bg-red-500 ',
        ],
        'hover:bg-gray-500 text-center',
      )}
    >
      {row.original.chqStatus === 'REJECTED'
        ? row.original.chqStatus
        : `${row.original.chqStatus} ${row.original.chqApprovalCount}/3`}
    </Badge>
  )
}

export const UpdatedAtColumn = ({ row }: CellContext<Cheques, unknown>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const accountTypes = useAccountTypes()
  const form = useForm<z.infer<typeof chequeUpdateSchema>>({
    defaultValues: {
      chqId: row.original.chqId,
      chqAccTypeId: row.original.transaction.account.accTypeId,
      chqAmount: Number.parseFloat(String(row.original.chqAmount)),
      chqIssueDate: new Date(row.original.chqIssueDate),
      chqPayeeName: row.original.chqPayeeName,
      chqNumber: row.original.chqNumber,
      chqStatus: row.original.chqStatus,
    },
    resolver: zodResolver(chequeUpdateSchema),
  })

  const updateCheque = useUpdateCheque({ cell: { row }, setIsOpen })

  const handleSubmit = (values: z.infer<typeof chequeUpdateSchema>) => {
    const fd = new FormData()

    Object.keys(values).forEach((key) => {
      fd.append(key, values[key as keyof typeof values] as any)
    })
    fd.append('chqTranId', row.original.chqTranId)
    updateCheque.mutate(fd)
  }
  return (
    <div className="flex justify-between items-center">
      <div>{new Date(row.original.chqUpdatedAt).toLocaleDateString()}</div>
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
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.chqId)
                }
              >
                Copy Cheque ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>Update Cheque</DropdownMenuItem>
              </DialogTrigger>
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
                      name="chqId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Cheque ID</FormLabel>
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
                      name="chqNumber"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Cheque Number</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Input
                              className="w-full"
                              placeholder="Cheque Number"
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
                      name="chqFile"
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
                                <SelectItem value="APPROVED">
                                  <Badge className="bg-emerald-500 hover:bg-gray-500">
                                    APPROVED
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="PENDING">
                                  <Badge className="bg-yellow-500 hover:bg-gray-500">
                                    PENDING
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="REJECTED">
                                  <Badge className="bg-red-500 hover:bg-gray-500">
                                    REJECTED
                                  </Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chqAccTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            {accountTypes.isSuccess && (
                              <ComboBox
                                data={accountTypes.data.accountTypes.map(
                                  (t) => ({
                                    label: t.accTypeName,
                                    value: t.accTypeId,
                                  }),
                                )}
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
                      name="chqIssueDate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Issue Date</FormLabel>
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
                  dialogTitle="You are about to update this cheque"
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
