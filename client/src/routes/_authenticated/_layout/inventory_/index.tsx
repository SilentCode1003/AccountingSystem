import DataTable from '@/components/DataTable'
import {
  inventoryColumns,
  type Inventories,
} from '@/components/table-columns/inventory.columns'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { PackagePlusIcon } from 'lucide-react'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog'
import { createInventorySchema } from '@/validators/inventory.validator'

export const Route = createFileRoute('/_authenticated/_layout/inventory/')({
  component: Inventory,
})

function CrudComponents() {
  const queryClient = useQueryClient()
  const createInventory = useMutation({
    mutationKey: ['CreateInventory'],
    mutationFn: async (payload: z.infer<typeof createInventorySchema>) => {
      const response = await fetch('http://localhost:3000/inventory', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      const data = (await response.json()) as Promise<{
        inventory: Inventories
      }>
      return data
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['Inventories'] })
    },
  })

  const form = useForm<z.infer<typeof createInventorySchema>>({
    defaultValues: {
      invAssetName: '',
      invStocks: 0,
      invStatus: 'GOOD',
    },
    resolver: zodResolver(createInventorySchema),
  })

  const handleSubmit = (values: z.infer<typeof createInventorySchema>) => {
    createInventory.mutate({
      invAssetName: values.invAssetName,
      invStocks: values.invStocks,
      invStatus: values.invStatus,
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2">
          Add Inventory <PackagePlusIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-">
        <AlertDialogHeader>Create Inventory</AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="invAssetName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Asset Name</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Asset Name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invStocks"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Asset Stocks</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Asset Stocks"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GOOD">GOOD</SelectItem>
                          <SelectItem value="WARNING">WARNING</SelectItem>
                          <SelectItem value="DEPLETED">DEPLETED</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <AlertDialogAction asChild>
                  <Button type="submit">Create</Button>
                </AlertDialogAction>
                <div className="flex gap-2">
                  <Button variant={'secondary'} onClick={() => form.reset()}>
                    Clear
                  </Button>
                  <AlertDialogCancel asChild>
                    <Button variant={'outline'}>Cancel</Button>
                  </AlertDialogCancel>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Inventory() {
  const Inventories = useQuery({
    queryKey: ['Inventories'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/inventory', {
        credentials: 'include',
      })
      const data = (await response.json()) as Promise<{
        inventories: Array<Inventories>
      }>
      return data
    },
  })

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      <div className="w-full translate-y-12 md:translate-y-12 sm:w-[70vw] mb-4"></div>
      {Inventories.isSuccess && (
        <DataTable
          className="w-full md:w-[70vw]"
          columns={inventoryColumns}
          data={Inventories.data.inventories}
          filter={[
            {
              filterColumn: 'invAssetName',
              filterPlaceHolder: 'Filter by name',
            },
            {
              filterColumn: 'invStatus',
              filterPlaceHolder: 'Filter by status',
              filterValues: ['GOOD', 'WARNING', 'DEPLETED'],
            },
          ]}
          CrudComponents={CrudComponents}
        ></DataTable>
      )}
    </div>
  )
}

export default Inventory
