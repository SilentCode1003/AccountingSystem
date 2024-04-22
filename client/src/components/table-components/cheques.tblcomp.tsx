import { useUpdateCheque } from "@/hooks/mutations";
import { useAccountTypes } from "@/hooks/queries";
import { chequeUpdateSchema } from "@/validators/cheques.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellContext } from "@tanstack/react-table";
import { MoreHorizontal, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Cheques } from "../table-columns/cheques.columns";
import { Button } from "../ui/button";
import DatePicker from "../ui/DatePicker";
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
import { PromptModal } from "../PromptModal";

export const IssueDateColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return new Date(row.original.chqIssueDate).toLocaleDateString();
};

export const PayeeNameColumn = ({ row }: CellContext<Cheques, unknown>) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(row.getValue("chqAmount"));

  return formatted;
};

export const CreatedAtColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return new Date(row.original.chqCreatedAt).toLocaleDateString();
};

export const AccountColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return (
    <div className="flex justify-between">
      <div>{row.original.account.accountType.accTypeName}</div>
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
                  navigator.clipboard.writeText(row.original.account.accId)
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
                <Text className="w-full sm:w-[33%]" variant={"body"}>
                  Account ID
                </Text>
                <Text variant={"label"} className="flex-1">
                  {row.original.account.accId}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={"body"}>
                  Account Type
                </Text>
                <Text variant={"label"} className="flex-1">
                  {row.original.account.accountType.accTypeName}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={"body"}>
                  Description
                </Text>
                <Text variant={"label"} className="flex-1">
                  {row.original.account.accDescription}
                </Text>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export const UpdatedAtColumn = ({ row }: CellContext<Cheques, unknown>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const accountTypes = useAccountTypes();
  const form = useForm<z.infer<typeof chequeUpdateSchema>>({
    defaultValues: {
      chqId: row.original.chqId,
      newData: {
        chqAccTypeId: row.original.account.accTypeId,
        chqAmount: Number.parseFloat(String(row.original.chqAmount)),
        chqIssueDate: new Date(row.original.chqIssueDate),
        chqPayeeName: row.original.chqPayeeName,
        chqStatus: row.original.chqStatus,
      },
    },
    resolver: zodResolver(chequeUpdateSchema),
  });

  const updateCheque = useUpdateCheque({ cell: { row }, setIsOpen });

  const handleSubmit = (values: z.infer<typeof chequeUpdateSchema>) => {
    updateCheque.mutate({ ...values, chqAccId: row.original.account.accId });
  };
  return (
    <div className="flex justify-between">
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
                      name="newData.chqPayeeName"
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
                      name="newData.chqAmount"
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
                    <FormField
                      control={form.control}
                      name="newData.chqStatus"
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
                                <SelectItem value="APPROVED">
                                  APPROVED
                                </SelectItem>
                                <SelectItem value="REJECTED">
                                  REJECTED
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newData.chqAccTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Account Type" />
                              </SelectTrigger>
                              <SelectContent>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newData.chqIssueDate"
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
      </div>
    </div>
  );
};
