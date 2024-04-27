import DataTable from "@/components/DataTable";
import { LoadingTable } from "@/components/LoadingComponents";
import { PromptModal } from "@/components/PromptModal";
import { accountTypeColumn } from "@/components/table-columns/accountTypes.column";
import {
  AlertDialog,
  AlertDialogCancel,
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
import { Text } from "@/components/ui/text";
import { useCreateAccountType } from "@/hooks/mutations";
import { useAccountTypes } from "@/hooks/queries";
import { accountTypesOptions } from "@/hooks/queries/options";
import { createAccountTypeSchema } from "@/validators/accountTypes.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { ListPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authenticated/_layout/settings/_layout/accountTypes"
)({
  loader: async ({ context }) => {
    const accountTypes = await context.queryClient.ensureQueryData(
      accountTypesOptions()
    );
    return { accountTypes };
  },
  component: AccountTypesComponent,
  pendingComponent: LoadingComponent,
});

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
    </div>
  );
}

const CrudComponents = () => {
  const [open, setOpen] = useState<boolean>(false);

  const createAccountType = useCreateAccountType({ setOpen });

  const form = useForm<z.infer<typeof createAccountTypeSchema>>({
    defaultValues: {
      accTypeName: "",
      accTypeDefault: "",
    },
    resolver: zodResolver(createAccountTypeSchema),
  });

  const handleSubmit = (values: z.infer<typeof createAccountTypeSchema>) => {
    createAccountType.mutate(values);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button className="flex gap-2" onClick={() => setOpen(true)}>
        Add Account Type <ListPlusIcon />
      </Button>
      <AlertDialogContent className="scale-75 sm:scale-100">
        <AlertDialogHeader>
          <Text variant={"heading3bold"}>Create Account Type</Text>
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
          <PromptModal
            dialogMessage="Continue?"
            prompType="ADD"
            dialogTitle="You are about to create a new account type"
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
};

function AccountTypesComponent() {
  const accountTypes = useAccountTypes();

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
  );
}
