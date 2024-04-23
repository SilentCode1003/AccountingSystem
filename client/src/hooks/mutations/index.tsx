import { Accounts } from '@/components/table-columns/accounts.columns'
import { AccountTypes } from '@/components/table-columns/accountTypes.column'
import { Cheques } from '@/components/table-columns/cheques.columns'
import { Employees } from '@/components/table-columns/employees.columns'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { Payrolls } from '@/components/table-columns/payrolls.columns'
import { Transactions } from '@/components/table-columns/transactions.columns'
import { toast } from '@/components/ui/use-toast'
import { updateAccountSchema } from '@/validators/accounts.validator'
import {
  createAccountTypeSchema,
  updateAccountTypeSchema,
} from '@/validators/accountTypes.validator'
import {
  chequeUpdateSchema,
  createChequeSchema,
} from '@/validators/cheques.validator'
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
  createPayrollSchema,
  updatePayrollSchema,
} from '@/validators/payrolls.validators'
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '@/validators/transactions.validator'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CellContext } from '@tanstack/react-table'
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update account',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update account status',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update account type',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to delete account type ',
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
    mutationFn: async (
      payload: z.infer<typeof chequeUpdateSchema> & { chqAccId: string },
    ) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques`,
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

    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update cheque',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to terminate employee',
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
      const data = (await response.json()) as Promise<{
        employee: Employees
      }>
      return data
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['Employees'],
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update employee',
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
    mutationFn: (payload: z.infer<typeof updateFormSchema>) => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/inventory`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          return data
        })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['Inventories'] })
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update inventory',
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

    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update payroll',
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
    mutationFn: async (payload: z.infer<typeof updateTransactionSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )
      const data = response.json() as Promise<{
        transaction: Transactions
      }>
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update transaction',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to create cheque',
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
      const data = await response.json()
      return data
    },
    onSuccess: async () => {
      setOpen(false)
      await queryClient.refetchQueries({ queryKey: ['Employees'] })
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to create employee',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to create inventory',
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
    mutationFn: async (payload: z.infer<typeof createPayrollSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/payrolls`,
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
    onSuccess: async () => {
      setOpen(false)
      await queryClient.refetchQueries({ queryKey: ['Payrolls'] })
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to create payroll',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to create account type',
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to update profile',
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
    mutationFn: async (payload: z.infer<typeof createTransactionSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      const data = (await response.json()) as {
        transaction: Transactions
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['Transactions'],
        (old: { transactions: Array<Transactions> }) => {
          return { transactions: [...old.transactions, data.transaction] }
        },
      )
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
    onError: () => {
      toast({
        title: (
          <div className="flex gap-2 items-centers">
            <CircleXIcon />
            Something went wrong!
          </div>
        ),
        description: 'Failed to create transaction',
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
      await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['CurrentUser'] })
      navigate({ to: '/' })
    },
  })
}
