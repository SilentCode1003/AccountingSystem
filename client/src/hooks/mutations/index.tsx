import { Accounts } from '@/components/table-columns/accounts.columns'
import { AccountTypes } from '@/components/table-columns/accountTypes.column'
import { Cheques } from '@/components/table-columns/cheques.columns'
import { Customers } from '@/components/table-columns/customers.columns'
import { Employees } from '@/components/table-columns/employees.columns'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { InventoryEntries } from '@/components/table-columns/inventoryEntries.columns'
import { Payrolls } from '@/components/table-columns/payrolls.columns'
import { Transactions } from '@/components/table-columns/transactions.columns'
import { Vendors } from '@/components/table-columns/vendors.columns'
import { toast } from '@/components/ui/use-toast'
import { updateAccountSchema } from '@/validators/accounts.validator'
import {
  createAccountTypeSchema,
  updateAccountTypeSchema,
} from '@/validators/accountTypes.validator'
import {
  createCustomerSchema,
  updateCustomersSchema,
} from '@/validators/customers.validator'
import {
  createEmployeeSchema,
  terminateEmployeeSchema,
  updateEmployeeSchema,
} from '@/validators/employees.validator'
import {
  createInventorySchema,
  updateFormSchema,
} from '@/validators/inventory.validator'
import { updatePayrollSchema } from '@/validators/payrolls.validators'
import { createTransactionSchema } from '@/validators/transactions.validator'
import {
  createVendorSchema,
  updateVendorSchema,
} from '@/validators/vendors.validator'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CellContext } from '@tanstack/react-table'
import fileDownload from 'js-file-download'
import { CircleXIcon, PartyPopperIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['CurrentUser'] })
      navigate({ to: '/login' })
    },
  })
}

export const useUpdateAccount = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateAccount'],
    mutationFn: async (payload: z.infer<typeof updateAccountSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accounts`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        account: Accounts
      }>

      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['accounts'],
        (old: { accounts: Array<Accounts> }) => {
          return {
            accounts: old.accounts.map((account) => {
              if (account.accId === data.account.accId) {
                return data.account
              }
              return account
            }),
          }
        },
      )
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Account was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update account',
        variant: 'destructive',
      })
    },
  })
}

export const useToggleIsActiveAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['toggleAccountIsActive'],
    mutationFn: async (
      payload: Pick<z.infer<typeof updateAccountSchema>, 'accId'>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accounts/${payload.accId}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ account: Accounts }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['accounts'],
        (old: { accounts: Array<Accounts> }) => {
          return {
            accounts: old.accounts.map((account) => {
              if (account.accId === data.account.accId) {
                return data.account
              }
              return account
            }),
          }
        },
      )
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Account status was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update account status',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateAccountType = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateAccountType'],
    mutationFn: async (payload: z.infer<typeof updateAccountTypeSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        accountType: AccountTypes
      }>

      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['accountTypes'],
        (old: { accountTypes: Array<AccountTypes> }) => {
          return {
            accountTypes: old.accountTypes.map((accType) => {
              if (accType.accTypeId === data.accountType.accTypeId) {
                return data.accountType
              }
              return accType
            }),
          }
        },
      )
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Account type was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update account type',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteAccountType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteAccountType'],
    mutationFn: async (
      payload: Pick<z.infer<typeof updateAccountTypeSchema>, 'accTypeId'>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes/${payload.accTypeId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        deletedAccountTypeId: string
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['accountTypes'],
        (old: { accountTypes: Array<AccountTypes> }) => {
          return {
            accountTypes: old.accountTypes.filter(
              (accType) => accType.accTypeId !== data.deletedAccountTypeId,
            ),
          }
        },
      )
      toast({
        title: (
          <div>
            <div className="flex gap-2 items-centers">
              <PartyPopperIcon />
              Success
            </div>
          </div>
        ),
        description: 'Account type was deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to delete account type ',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateCheque = ({
  setIsOpen,
  cell,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  cell: Pick<CellContext<Cheques, unknown>, 'row'>
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateCheque'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques`,
        {
          method: 'PUT',
          body: payload,
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        cheque: Cheques
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['Cheques'],
        (old: { cheques: Array<Cheques> }) => {
          const newCheques = old.cheques.map((cheque) => {
            if (cheque.chqId === cell.row.original.chqId) {
              return data.cheque
            }
            return cheque
          })
          return { cheques: newCheques }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setIsOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Cheque was updated successfully',
      })
    },

    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update cheque',
        variant: 'destructive',
      })
    },
  })
}

export const useTerminateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['terminateEmployee'],
    mutationFn: async (payload: z.infer<typeof terminateEmployeeSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/employees/${payload.empId}`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        employee: Employees
      }>
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['Employees'],
        (old: { employees: Array<Employees> }) => {
          const newEmployees = old.employees.map((employee) => {
            if (employee.empId === data.employee.empId) {
              return data.employee
            }
            return employee
          })
          return { employees: newEmployees }
        },
      )
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Employee was terminated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to terminate employee',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateEmployee = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateEmployee'],
    mutationFn: async (payload: z.infer<typeof updateEmployeeSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/employees`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        employee: Employees
      }>
      return data
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['Employees'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['Payrolls'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Employee was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update employee',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateCustomer = ({
  setOpen,
  cell,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  cell: Pick<CellContext<Customers, unknown>, 'row'>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateCustomer'],
    mutationFn: async (payload: z.infer<typeof updateCustomersSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/customers`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        customer: Customers
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['customers'],
        (old: { customers: Array<Customers> }) => {
          const newCustomers = old.customers.map((customer) => {
            if (customer.custId === cell.row.original.custId) {
              return data.customer
            }
            return customer
          })
          return { customers: newCustomers }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['inventoryEntries'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Customer was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update Customer',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateVendor = ({
  setOpen,
  cell,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  cell: Pick<CellContext<Vendors, unknown>, 'row'>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateVendor'],
    mutationFn: async (payload: z.infer<typeof updateVendorSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/vendors`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        vendor: Vendors
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['vendors'],
        (old: { vendors: Array<Vendors> }) => {
          const newVendors = old.vendors.map((customer) => {
            if (customer.vdId === cell.row.original.vdId) {
              return data.vendor
            }
            return customer
          })
          return { vendors: newVendors }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['inventoryEntries'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Vendor was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update Vendor',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateInventory = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateInventory'],
    mutationFn: async (payload: z.infer<typeof updateFormSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/inventory`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        inventory: Inventories
      }>

      return data
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['Inventories'] })
      await queryClient.invalidateQueries({
        queryKey: ['inventoryEntries'],
        type: 'inactive',
      })
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Inventory was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update inventory',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateInventoryEntry = ({
  setIsOpen,
  cell,
}: {
  setIsOpen: (value: boolean) => void
  cell: Pick<CellContext<InventoryEntries, unknown>, 'row'>
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateInventoryEntry'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/inventoryEntries`,
        {
          method: 'PUT',
          body: payload,
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        inventoryEntry: InventoryEntries
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['inventoryEntries'],
        (old: { inventoryEntries: Array<InventoryEntries> }) => {
          const newInventoryEnties = old.inventoryEntries.map(
            (inventoryEntry) => {
              if (inventoryEntry.invEntryId === cell.row.original.invEntryId) {
                return data.inventoryEntry
              }
              return inventoryEntry
            },
          )
          return { inventoryEntries: newInventoryEnties }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setIsOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Inventory entry was updated successfully',
      })
    },

    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update inventory entry',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdatePayroll = ({
  setIsOpen,
  cell,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  cell: Pick<CellContext<Payrolls, unknown>, 'row'>
}) => {
  const queryClient = useQueryClient()

  return useMutation({
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
      if (!response.ok) throw new Error((await response.json()).error)

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
            if (payroll.prId === cell.row.original.prId) {
              return data.payroll
            }
            return payroll
          })
          return { payrolls: newPayrolls }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setIsOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Payroll was updated successfully',
      })
    },

    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update payroll',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateTransaction = ({
  setOpenUpdate,
  cell,
}: {
  setOpenUpdate: (value: boolean) => void
  cell: Pick<CellContext<Transactions, unknown>, 'row'>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateTransaction'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          method: 'PUT',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = response.json() as Promise<{
        transaction: Transactions
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['Transactions'],
        (old: { transactions: Array<Transactions> }) => {
          const newTransactions = old.transactions.map((transaction) => {
            if (transaction.tranId === cell.row.original.tranId) {
              return data.transaction
            }
            return transaction
          })
          return { transactions: newTransactions }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      setOpenUpdate(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Transaction was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update transaction',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateCheque = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ cheque: Cheques }>
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
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Cheque was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create cheque',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateEmployee = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: z.infer<typeof createEmployeeSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/employees`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ employee: Employees }>
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(
        ['Employees'],
        (old: { employees: Array<Employees> }) => {
          return {
            employees: [...old.employees, data.employee],
          }
        },
      )
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Employee was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create employee',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateCustomer = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: z.infer<typeof createCustomerSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/customers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ customer: Customers }>
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(
        ['customers'],
        (old: { customers: Array<Customers> }) => {
          return {
            customers: [...old.customers, data.customer],
          }
        },
      )
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Customer was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create Customer',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateVendor = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: z.infer<typeof createVendorSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/vendors`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ vendor: Vendors }>
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(
        ['vendors'],
        (old: { vendors: Array<Vendors> }) => {
          return {
            vendors: [...old.vendors, data.vendor],
          }
        },
      )
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Vendor was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create Vendor',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateInventory = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['CreateInventory'],
    mutationFn: async (payload: z.infer<typeof createInventorySchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/inventory`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        inventory: Inventories
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['Inventories'],
        (old: { inventories: Array<Inventories> }) => {
          return {
            inventories: [...old.inventories, data.inventory],
          }
        },
      )
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Inventory was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create inventory',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateInventoryEntry = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['CreateInventoryEntry'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/inventoryEntries`,
        {
          method: 'POST',
          body: payload,
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        inventoryEntry: InventoryEntries
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['inventoryEntries'],
        (old: { inventoryEntries: Array<InventoryEntries> }) => {
          return {
            inventoryEntries: [...old.inventoryEntries, data.inventoryEntry],
          }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Inventory entry was created successfully',
      })
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create inventory entry',
        variant: 'destructive',
      })
    },
  })
}

export const useCreatePayroll = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/payrolls`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ payroll: Payrolls }>
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(
        ['Payrolls'],
        (old: { payrolls: Array<Payrolls> }) => {
          return {
            payrolls: [...old.payrolls, data.payroll],
          }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['Transactions'],
        type: 'inactive',
      })
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Payroll was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create payroll',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateAccountType = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
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
      if (!response.ok) throw new Error((await response.json()).error)

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
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Account type was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create account type',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateUser = ({
  setToggleEdit,
  setUserData,
}: {
  setUserData: React.Dispatch<
    React.SetStateAction<{
      fullName: string
      username: string
      password?: string
      profileLink: string
      profilePic: string | File
      contactNumber: string
    }>
  >
  setToggleEdit: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        method: 'PUT',
        credentials: 'include',
        body: payload,
      })

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        user: {
          userUsername: string
          userFullName: string
          userContactNumber: string
          userProfilePic: string
        }
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(['userData'], () => {
        return {
          user: {
            userUsername: data.user.userUsername,
            userFullName: data.user.userFullName,
            userContactNumber: data.user.userContactNumber,
            userProfilePic: data.user.userProfilePic,
          },
        }
      })
      setToggleEdit((prev) => !prev)
      setUserData({
        fullName: data.user.userFullName,
        username: data.user.userUsername,
        profileLink: '',
        password: '',
        profilePic: data.user.userProfilePic,
        contactNumber: data.user.userContactNumber,
      })
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Profile was updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to update profile',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateTransaction = (
  form: UseFormReturn<z.infer<typeof createTransactionSchema>>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: async (payload: FormData) => {
      console.log(payload)
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      const data = (await response.json()) as {
        transaction: Transactions
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['Transactions'],
        (old: { transactions: Array<Transactions> }) => {
          return { transactions: [...old.transactions, data.transaction] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      form.reset()
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Transaction was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create transaction',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateTransactionByFile = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions/file`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      const data = (await response.json()) as {
        transaction: Transactions
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['Transactions'],
        (old: { transactions: Array<Transactions> }) => {
          return { transactions: [...old.transactions, data.transaction] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Transaction was created successfully',
      })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to create transaction',
        variant: 'destructive',
      })
    },
  })
}

export const useLogin = () => {
  type LoginPayload = {
    username: string
    password: string
  }
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (payload: LoginPayload) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries()
      navigate({ to: '/' })
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: error.message ?? 'Failed to login',
        variant: 'destructive',
      })
    },
  })
}

export const useDownloadFile = (fileName: string) => {
  return useMutation({
    mutationKey: ['downloadFile'],
    mutationFn: async () => {
      const params = new URLSearchParams({ fileName })
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/download/?` + params,
        {
          method: 'GET',
          credentials: 'include',
        },
      )
      const data = await response.blob()
      return { data, fileName }
    },
    onSuccess: (data) => {
      fileDownload(data.data, data.fileName.split(' ')[1])
    },
  })
}
