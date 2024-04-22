import { useToggleIsActiveAccount, useUpdateAccount } from "@/hooks/mutations";
import { useAccountTypes } from "@/hooks/queries";
import { updateAccountSchema } from "@/validators/accounts.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellContext } from "@tanstack/react-table";
import { MoreHorizontalIcon, ShieldCheckIcon, ShieldXIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Accounts } from "../table-columns/accounts.columns";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Text } from "../ui/text";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { PromptModal } from "../PromptModal";

export const AccountAmountColumn = ({
  row,
}: CellContext<Accounts, unknown>) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(row.original.accAmount);
  return formatted;
};

export const AccountIsActiveColumn = ({
  row,
}: CellContext<Accounts, unknown>) => {
  const accountTypes = useAccountTypes();
  const form = useForm({
    defaultValues: {
      accId: row.original.accId,
      newData: {
        accIsActive: row.original.accIsActive,
        accName: row.original.accName,
        accTypeId: row.original.accTypeId,
        accAmount: Number(parseFloat(String(row.original.accAmount))),
        accDescription: row.original.accDescription,
      },
    },
    resolver: zodResolver(updateAccountSchema),
  });

  const updateAccount = useUpdateAccount();

  const toggleAccountIsActive = useToggleIsActiveAccount();

  const handleSubmit = (values: z.infer<typeof updateAccountSchema>) => {
    updateAccount.mutate(values);
  };

  return (
    <div className="flex justify-between">
      <div className="min-w-24">
        {row.original.accIsActive ? "Active" : "Inactive"}
      </div>
      <div>
        <AlertDialog>
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
                  onClick={() =>
                    navigator.clipboard.writeText(row.original.accId)
                  }
                >
                  Copy Account ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Account</DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    Toggle Account Status{" "}
                    {row.original.accIsActive ? (
                      <ShieldCheckIcon />
                    ) : (
                      <ShieldXIcon />
                    )}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptModal
              callback={() =>
                toggleAccountIsActive.mutate({
                  accId: row.original.accId,
                })
              }
              nonButton
              dialogMessage="Continue?"
              prompType="DELETE"
              dialogTitle="You are about to terminate this account type! Data loss may occur and cannot be undone!"
              triggerText="DELETE ACCOUNT TYPE"
            />

            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Account</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="accId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Account ID</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input disabled className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.accName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Account Name</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Account Name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="newData.accTypeId"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <div className="flex items-center justify-between">
                                <FormLabel>Account Type</FormLabel>
                              </div>
                              <FormControl>
                                {accountTypes.isSuccess && (
                                  <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Account type" />
                                    </SelectTrigger>
                                    <SelectContent className="flex-1">
                                      {accountTypes.isSuccess && (
                                        <SelectGroup>
                                          {accountTypes.data.accountTypes.map(
                                            (accType) => (
                                              <SelectItem
                                                key={accType.accTypeId}
                                                value={accType.accTypeId}
                                              >
                                                {accType.accTypeName}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectGroup>
                                      )}
                                    </SelectContent>
                                  </Select>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.accDescription"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Account Description</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Account Description"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.accAmount"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Account Amount</FormLabel>
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
                                      ? ""
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
                      </div>
                    </div>
                  </form>
                </Form>
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        form.handleSubmit(handleSubmit)();
                      }}
                      type="submit"
                    >
                      Update
                    </Button>
                  </DialogClose>
                  <div className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        form.clearErrors();
                        form.reset();
                      }}
                    >
                      Clear
                    </Button>
                    <DialogClose asChild>
                      <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDialog>
      </div>
    </div>
  );
};
