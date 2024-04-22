import DataTable from "@/components/DataTable";
import { LoadingTable } from "@/components/LoadingComponents";
import { PromptModal } from "@/components/PromptModal";
import { inventoryColumns } from "@/components/table-columns/inventory.columns";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInventory } from "@/hooks/mutations";
import { useInventories } from "@/hooks/queries";
import { inventoriesOptions } from "@/hooks/queries/options";
import { createInventorySchema } from "@/validators/inventory.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { PackagePlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/_layout/inventory/")({
  loader: async ({ context }) => {
    const inventories =
      await context.queryClient.ensureQueryData(inventoriesOptions());
    return { inventories };
  },
  component: Inventory,
  pendingComponent: LoadingComponent,
});

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
    </div>
  );
}

function CrudComponents() {
  const [open, setOpen] = useState<boolean>(false);
  const createInventory = useCreateInventory({ setOpen });
  const form = useForm<z.infer<typeof createInventorySchema>>({
    defaultValues: {
      invAssetName: "",
      invStocks: 0,
      invStatus: "GOOD",
    },
    resolver: zodResolver(createInventorySchema),
  });

  const handleSubmit = (values: z.infer<typeof createInventorySchema>) => {
    createInventory.mutate({
      invAssetName: values.invAssetName,
      invStocks: values.invStocks,
      invStatus: values.invStatus,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2">
          Add Inventory <PackagePlusIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="scale-75 md:scale-100">
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
            </div>
          </form>
        </Form>
        <div className="flex justify-between">
          <PromptModal
            dialogMessage="Continue?"
            prompType="ADD"
            dialogTitle="You are about to create a new inventory"
            triggerText="Create"
            callback={form.handleSubmit(handleSubmit)}
          />
          <div className="flex gap-2 ">
            <Button variant={"secondary"} onClick={() => form.clearErrors()}>
              Clear
            </Button>
            <AlertDialogCancel asChild>
              <Button variant={"outline"} className="mt-0">
                Cancel
              </Button>
            </AlertDialogCancel>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Inventory() {
  const Inventories = useInventories();

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      <div className="w-full translate-y-12 md:translate-y-12 sm:w-[70vw] mb-4"></div>
      {Inventories.isSuccess && (
        <DataTable
          showVisibility
          className="w-full md:w-[70vw]"
          columns={inventoryColumns}
          data={Inventories.data.inventories}
          filter={[
            {
              filterColumn: "invAssetName",
              filterPlaceHolder: "Filter by name",
            },
            {
              filterColumn: "invStatus",
              filterPlaceHolder: "Filter by status",
              filterValues: ["GOOD", "WARNING", "DEPLETED"],
            },
          ]}
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  );
}

export default Inventory;
