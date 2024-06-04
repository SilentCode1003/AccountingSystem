import { Accounts } from '@/components/table-columns/accounts.columns'
import { AccountTypes } from '@/components/table-columns/accountTypes.column'
import { Cheques } from '@/components/table-columns/cheques.columns'
import { Customers } from '@/components/table-columns/customers.columns'
import { Employees } from '@/components/table-columns/employees.columns'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { InventoryEntries } from '@/components/table-columns/inventoryEntries.columns'
import { ModesOfPayment } from '@/components/table-columns/modesOfPayment.columns'
import { Payrolls } from '@/components/table-columns/payrolls.columns'
import { Routes } from '@/components/table-columns/routes.columns'
import { Transactions } from '@/components/table-columns/transactions.columns'
import { TransactionTypes } from '@/components/table-columns/transactionTypes.columns'
import { Users } from '@/components/table-columns/users.columns'
import { Vendors } from '@/components/table-columns/vendors.columns'
import { toast } from '@/components/ui/use-toast'
import { updateAccountSchema } from '@/validators/accounts.validator'
import {
  createAccountTypeSchema,
  updateAccountTypeSchema,
} from '@/validators/accountTypes.validator'
import {
  changePasswordSchema,
  forgetPasswordSchema,
} from '@/validators/auth.validator'
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
import {
  createModeOfPaymentSchema,
  updateModeOfPaymentSchema,
} from '@/validators/modesOfPayment.validator'
import { updatePayrollSchema } from '@/validators/payrolls.validators'
import {
  deleteRouteSchema,
  updateRouteSchema,
} from '@/validators/routes.validator'
import { createTransactionSchema } from '@/validators/transactions.validator'
import {
  createTransactionTypeSchema,
  updateTransactionTypeSchema,
} from '@/validators/transactionTypes.validator'
import {
  createUserSchema,
  updateUserSchema,
} from '@/validators/users.validator'
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
      await queryClient.refetchQueries({ queryKey: ['currentUser'] })
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
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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

export const useToggleAccountType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['toggleAccountType'],
    mutationFn: async (
      payload: Pick<z.infer<typeof updateAccountTypeSchema>, 'accTypeId'>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes/${payload.accTypeId}`,
        {
          method: 'PUT',
          credentials: 'include',
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
      ),
        await queryClient.invalidateQueries({
          queryKey: ['cashFlowBarChart'],
          type: 'inactive',
        })
      toast({
        title: (
          <div>
            <div className="flex gap-2 items-centers">
              <PartyPopperIcon />
              Success
            </div>
          </div>
        ),
        description: 'Account type was toggled successfully',
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
        description: error.message ?? 'Failed to toggle account type ',
        variant: 'destructive',
      })
    },
  })
}

export const useToggleUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['toggleUser'],
    mutationFn: async (
      payload: Pick<z.infer<typeof updateUserSchema>, 'userId'>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/${payload.userId}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        user: Users
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['users'],
        (old: { users: Array<Users> }) => {
          return {
            users: old.users.map((user) => {
              if (user.userId === data.user.userId) {
                return data.user
              }
              return user
            }),
          }
        },
      ),
        toast({
          title: (
            <div>
              <div className="flex gap-2 items-centers">
                <PartyPopperIcon />
                Success
              </div>
            </div>
          ),
          description: 'User was toggled successfully',
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
        description: error.message ?? 'Failed to toggle user ',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateTransactionType = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateTransactionType'],
    mutationFn: async (
      payload: z.infer<typeof updateTransactionTypeSchema>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactionTypes`,
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
        transactionType: TransactionTypes
      }>

      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['transactionTypes'],
        (old: { transactionTypes: Array<TransactionTypes> }) => {
          return {
            transactionTypes: old.transactionTypes.map((tranType) => {
              if (tranType.tranTypeId === data.transactionType.tranTypeId) {
                return data.transactionType
              }
              return tranType
            }),
          }
        },
      ),
        await queryClient.invalidateQueries({
          queryKey: ['payrolls'],
          type: 'inactive',
        })
      await queryClient.invalidateQueries({
        queryKey: ['cheques'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['inventoryEntries'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypes'],
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
        description: 'Transaction type was updated successfully',
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
        description: error.message ?? 'Failed to update transaction type',
        variant: 'destructive',
      })
    },
  })
}

export const useToggleTransactionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['toggleTransactionType'],
    mutationFn: async (
      payload: Pick<z.infer<typeof updateTransactionTypeSchema>, 'tranTypeId'>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactionTypes/${payload.tranTypeId}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        transactionType: TransactionTypes
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['transactionTypes'],
        (old: { transactionTypes: Array<TransactionTypes> }) => {
          return {
            transactionTypes: old.transactionTypes.map((tranType) => {
              if (tranType.tranTypeId === data.transactionType.tranTypeId) {
                return data.transactionType
              }
              return tranType
            }),
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
        description: 'Transaction type was toggled successfully',
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
        description: error.message ?? 'Failed to toggle transaction type ',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateModeOfPayment = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateModeOfPayment'],
    mutationFn: async (payload: z.infer<typeof updateModeOfPaymentSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/modesOfPayment`,
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
        modeOfPayment: ModesOfPayment
      }>

      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['modesOfPayment'],
        (old: { modesOfPayment: Array<ModesOfPayment> }) => {
          return {
            modesOfPayment: old.modesOfPayment.map((mop) => {
              if (mop.mopId === data.modeOfPayment.mopId) {
                return data.modeOfPayment
              }
              return mop
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
        description: 'Mode of payment was updated successfully',
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
        description: error.message ?? 'Failed to update mode of payment',
        variant: 'destructive',
      })
    },
  })
}

export const useToggleModeOfPayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['toggleModeOfPayment'],
    mutationFn: async (
      payload: Pick<z.infer<typeof updateModeOfPaymentSchema>, 'mopId'>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/modesOfPayment/${payload.mopId}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        modeOfPayment: ModesOfPayment
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['modesOfPayment'],
        (old: { modesOfPayment: Array<ModesOfPayment> }) => {
          console.log(data)
          return {
            modesOfPayment: old.modesOfPayment.map((mop) => {
              if (mop.mopId === data.modeOfPayment.mopId) {
                return data.modeOfPayment
              }
              return mop
            }),
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
        description: 'Mode of payment was toggled successfully',
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
        description: error.message ?? 'Failed to toggle mode of payment ',
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
        ['cheques'],
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
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        ['employees'],
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
        queryKey: ['employees'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['payrolls'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
        type: 'inactive',
      })
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
        queryKey: ['transactions'],
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
        queryKey: ['transactions'],
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
      await queryClient.refetchQueries({ queryKey: ['inventories'] })
      await queryClient.invalidateQueries({
        queryKey: ['inventoryEntries'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        ['payrolls'],
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
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        ['transactions'],
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
      }),
        await queryClient.invalidateQueries({
          queryKey: ['cashFlowBarChart'],
          type: 'inactive',
        })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        ['cheques'],
        (old: { cheques: Array<Cheques> }) => {
          return { cheques: [...old.cheques, data.cheque] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        ['employees'],
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
        ['inventories'],
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
        queryKey: ['transactions'],
        type: 'inactive',
      }),
        await queryClient.invalidateQueries({
          queryKey: ['cashFlowBarChart'],
          type: 'inactive',
        })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        ['payrolls'],
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
        queryKey: ['transactions'],
        type: 'inactive',
      }),
        await queryClient.invalidateQueries({
          queryKey: ['cashFlowBarChart'],
          type: 'inactive',
        })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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

export const useCreateModeOfPayment = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: z.infer<typeof createModeOfPaymentSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/modesOfPayment`,
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
        modeOfPayment: ModesOfPayment
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['modesOfPayment'],
        (old: { modesOfPayment: Array<ModesOfPayment> }) => {
          return {
            modesOfPayment: [...old.modesOfPayment, data.modeOfPayment],
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
        description: 'Mode of payment was created successfully',
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
        description: error.message ?? 'Failed to create mode of payment',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateTransactionType = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      payload: z.infer<typeof createTransactionTypeSchema>,
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactionTypes`,
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
        transactionType: TransactionTypes
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['transactionTypes'],
        (old: { transactionTypes: Array<TransactionTypes> }) => {
          return {
            transactionTypes: [...old.transactionTypes, data.transactionType],
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
        description: 'Transaction type was created successfully',
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
        description: error.message ?? 'Failed to create transaction type',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateUser = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: z.infer<typeof createUserSchema>) => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{ user: Users }>
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(
        ['users'],
        (old: { users: Array<Users> }) => {
          return {
            users: [...old.users, data.user],
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
        description: 'User was created successfully',
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
        description: error.message ?? 'Failed to create User',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateUser = ({
  setOpen,
  setUserData,
}: {
  setUserData?: React.Dispatch<
    React.SetStateAction<{
      fullName: string
      username: string
      password?: string
      profileLink: string
      profilePic: string | File
      contactNumber: string
    }>
  >
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
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
      await queryClient.invalidateQueries({
        queryKey: ['users'],
        type: 'inactive',
      })
      setOpen(false)
      if (setUserData)
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
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as {
        transaction: Transactions
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['transactions'],
        (old: { transactions: Array<Transactions> }) => {
          return { transactions: [...old.transactions, data.transaction] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
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
    mutationKey: ['createTransactionByFile'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions/file`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as {
        transactions: Array<Transactions>
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['transactions'],
        (old: { transactions: Array<Transactions> }) => {
          return { transactions: [...old.transactions, ...data.transactions] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['liquidations'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['budgets'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['employeeBudgets'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['routes'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['routeDiscrepancies'],
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

export const useCreatePayrollByFile = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createPayrollByFile'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/payrolls/file`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as {
        payrolls: Array<Payrolls>
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['payrolls'],
        (old: { payrolls: Array<Payrolls> }) => {
          return { payrolls: [...old.payrolls, ...data.payrolls] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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
        description: error.message ?? 'Failed to create Payroll',
        variant: 'destructive',
      })
    },
  })
}

export const useCreateChequeByFile = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createChequeByFile'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques/file`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as {
        cheques: Array<Cheques>
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['cheques'],
        (old: { cheques: Array<Cheques> }) => {
          return { cheques: [...old.cheques, ...data.cheques] }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['cashFlowBarChart'],
        type: 'inactive',
      })
      await queryClient.invalidateQueries({
        queryKey: ['accountTypeTotalPerMonth'],
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

export const useDownloadFile = (fileName: string, dirPath: string) => {
  return useMutation({
    mutationKey: ['downloadFile'],
    mutationFn: async () => {
      const params = new URLSearchParams({ fileName, dirPath })
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
      fileDownload(data.data, data.fileName.split(' ')[1] ?? fileName)
    },
  })
}

export const useSyncEmployeeByAPI = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['syncEmployeeByAPI'],
    mutationFn: async (payload: { employeeApi: string }) => {
      const params = new URLSearchParams({ employeeApi: payload.employeeApi })
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/syncEmployeesByAPI/?` +
          params,
        {
          method: 'POST',
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        syncedEmployees: Array<Employees>
      }>
      return data
    },
    onSuccess: async (data) => {
      setOpen(false)
      await queryClient.setQueryData(['employees'], () => ({
        employees: data.syncedEmployees,
      }))
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Employees synced successfully',
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
        description: error.message ?? 'Failed to sync employees',
        variant: 'destructive',
      })
    },
  })
}

export const useSyncEmployeeByFile = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['syncEmployeeByFile'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/syncEmployeesByFile`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as {
        syncedEmployees: Array<Employees>
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(['employees'], () => ({
        employees: data.syncedEmployees,
      }))
      setOpen(false)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Employees synced successfully',
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
        description: error.message ?? 'Failed to sync employees',
        variant: 'destructive',
      })
    },
  })
}

export const useForgetPassword = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return useMutation({
    mutationKey: ['forgetPassword'],
    mutationFn: async (payload: z.infer<typeof forgetPasswordSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/forgetPassword`,
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
      return response.json()
    },
    onSuccess: async (data) => {
      setOpen(true)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Email sent successfully',
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
        description: error.message ?? 'Failed to send email',
        variant: 'destructive',
      })
    },
  })
}

export const useChangePassword = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return useMutation({
    mutationKey: ['changePassword'],
    mutationFn: async (payload: z.infer<typeof changePasswordSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/changePassword/reset?` +
          new URLSearchParams({ ...payload }),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      return response.json()
    },
    onSuccess: async (data) => {
      setOpen(true)
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Password changed successfully',
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
        description: error.message ?? 'Failed to change password',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateRoute = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateRoute'],
    mutationFn: async (payload: z.infer<typeof updateRouteSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/routes`,
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
        route: Routes
      }>

      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['routes'],
        (old: { routes: Array<Routes> }) => {
          return {
            routes: old.routes.map((route) => {
              if (route.routeId === data.route.routeId) {
                return data.route
              }
              return route
            }),
          }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['routeDiscrepancies'],
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
        description: 'Route was updated successfully',
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
        description: error.message ?? 'Failed to update route',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteRoute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteRoute'],
    mutationFn: async (payload: z.infer<typeof deleteRouteSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/routes/${payload.routeId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        deletedRouteId: string
      }>

      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['routes'],
        (old: { routes: Array<Routes> }) => {
          return {
            routes: old.routes.filter(
              (route) => route.routeId !== data.deletedRouteId,
            ),
          }
        },
      )
      await queryClient.invalidateQueries({
        queryKey: ['routeDiscrepancies'],
        type: 'inactive',
      })
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <PartyPopperIcon />
            Success
          </div>
        ),
        description: 'Route was deleted successfully',
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
        description: error.message ?? 'Failed to delete route',
        variant: 'destructive',
      })
    },
  })
}
