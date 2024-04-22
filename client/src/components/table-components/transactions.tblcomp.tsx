import { Transactions } from "@/components/table-columns/transactions.columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { useUpdateTransaction } from "@/hooks/mutations";
import { useAccountTypes, useTransactionPartners } from "@/hooks/queries";
import { updateTransactionSchema } from "@/validators/transactions.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellContext, Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DatePicker from "../ui/DatePicker";
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
  MultiDialog,
  MultiDialogContainer,
  MultiDialogTrigger,
  useMultiDialog,
} from "../ui/multi-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DialogProps } from "@radix-ui/react-dialog";
import { PromptModal } from "../PromptModal";

export const TransactionIndexColumn = ({
  row,
}: CellContext<Transactions, unknown>) => {
  return row.index + 1;
};

export const TransactionAccountIDColumn = ({
  row,
}: CellContext<Transactions, unknown>) => {
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
                  navigator.clipboard.writeText(row.original.tranAccId)
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

export const TransactionAmountColumn = ({
  row,
}: CellContext<Transactions, unknown>) => {
  const amount = parseFloat(row.getValue("tranAmount"));
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
  return formatted;
};

export const TransactionDate = ({
  row,
}: CellContext<Transactions, unknown>) => {
  const date = new Date(row.original.tranTransactionDate);

  return date.toLocaleDateString();
};

export const TransactionWithColumn = ({
  row,
}: CellContext<Transactions, unknown>) => {
  let data: {
    id: string;
    type: string;
    name: string;
    contactInfo: string;
    email: string;
    isActive?: string;
    dateHired?: string;
    address?: string;
  };
  if (row.original.tranEmpId) {
    data = {
      id: row.original.employee.empId,
      type: "employee",
      name: row.original.employee.empName,
      contactInfo: row.original.employee.empContactInfo,
      email: row.original.employee.empEmail,
      address: row.original.employee.empAddress,
    };
  } else if (row.original.tranCustId) {
    data = {
      id: row.original.customer.custId,
      type: "customer",
      name: row.original.customer.custName,
      contactInfo: row.original.customer.custContactInfo,
      email: row.original.customer.custEmail,
      address: row.original.customer.custAddress,
    };
  } else {
    data = {
      id: row.original.vendor.vdId,
      type: "vendor",
      name: row.original.vendor.vdName,
      contactInfo: row.original.vendor.vdContactInfo,
      email: row.original.vendor.vdEmail,
    };
  }
  return (
    <div className="flex justify-between">
      <div>{data.name}</div>
      <div>
        <MultiDialog>
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
                onClick={() => navigator.clipboard.writeText(data.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <MultiDialogTrigger value="viewDetails">
                <DropdownMenuItem className="hover:cursor-pointer">
                  View Details
                </DropdownMenuItem>
              </MultiDialogTrigger>
              <MultiDialogTrigger value="updateTransaction">
                <DropdownMenuItem className="hover:cursor-pointer">
                  Update Transaction
                </DropdownMenuItem>
              </MultiDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <MultiDialogContainer value="viewDetails">
            <Dialog>
              <DialogContent className="rounded-md sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {(data.type === "employee" && "Employee Details") ||
                      (data.type === "customer" && "Customer Details") ||
                      (data.type === "vendor" && "Vendor Details")}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row">
                    <Text className="w-full sm:w-[33%]" variant={"body"}>
                      Name
                    </Text>
                    <Text variant={"label"} className="flex-1">
                      {data.name}
                    </Text>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <Text className="w-full sm:w-[33%]" variant={"body"}>
                      Email
                    </Text>
                    <Text variant={"label"} className="flex-1">
                      {data.email}
                    </Text>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <Text className="w-full sm:w-[33%]" variant={"body"}>
                      Contact Info
                    </Text>
                    <Text variant={"label"} className="flex-1">
                      {data.contactInfo}
                    </Text>
                  </div>
                  {data.address && (
                    <div className="flex flex-col sm:flex-row">
                      <Text className="w-full sm:w-[33%]" variant={"body"}>
                        Address
                      </Text>
                      <Text variant={"label"} className="flex-1">
                        {data.address}
                      </Text>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </MultiDialogContainer>
          <MultiDialogContainer value="updateTransaction">
            <UpdateFormDialog row={row} />
          </MultiDialogContainer>
        </MultiDialog>
      </div>
    </div>
  );
};

function UpdateFormDialog(props: DialogProps & { row: Row<Transactions> }) {
  const [, setOpen] = useMultiDialog("updateTransaction");
  const accountTypes = useAccountTypes();
  const form = useForm<z.infer<typeof updateTransactionSchema>>({
    defaultValues: {
      tranId: props.row.original.tranId,
      newData: {
        tranAccId: props.row.original.account.accId,
        tranAmount: Number.parseFloat(String(props.row.original.tranAmount)),
        tranDescription: props.row.original.tranDescription,
        tranPartner:
          props.row.original.tranEmpId ??
          props.row.original.tranCustId ??
          props.row.original.tranVdId,
        tranAccTypeId: props.row.original.account.accountType.accTypeId,
        tranTransactionDate: new Date(props.row.original.tranTransactionDate),
      },
    },
    resolver: zodResolver(updateTransactionSchema),
  });
  const transactionPartners = useTransactionPartners();

  const updateTransaction = useUpdateTransaction({
    setOpenUpdate: setOpen,
    cell: { row: props.row },
  });

  const handleSubmit = (values: z.infer<typeof updateTransactionSchema>) => {
    updateTransaction.mutate(values);
  };
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>Update Transaction</DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="tranId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Transaction ID</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        disabled
                        className="w-full"
                        placeholder="Transaction ID"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormField
                    name="newData.tranAmount"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Amount</FormLabel>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <Input
                            className="w-full"
                            type="number"
                            placeholder="Total Deduction"
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
                <div className="flex-1 flex flex-col">
                  <FormField
                    name="newData.tranTransactionDate"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Transaction Date</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              setDate={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <FormField
                  name="newData.tranPartner"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex flex-col justify-between">
                        <FormLabel>Person Transacting with</FormLabel>
                      </div>
                      <FormControl>
                        {transactionPartners.isSuccess && (
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pick One" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Employees</SelectLabel>
                                {transactionPartners.data.employees.map(
                                  (emp) => (
                                    <SelectItem
                                      key={emp.empId}
                                      value={emp.empId}
                                    >
                                      {emp.empName} | Employee
                                    </SelectItem>
                                  )
                                )}
                              </SelectGroup>
                              <SelectSeparator />
                              <SelectGroup>
                                <SelectLabel>Customers</SelectLabel>
                                {transactionPartners.data.customers.map(
                                  (cust) => (
                                    <SelectItem
                                      key={cust.custId}
                                      value={cust.custId}
                                    >
                                      {cust.custName} | Customers
                                    </SelectItem>
                                  )
                                )}
                              </SelectGroup>
                              <SelectSeparator />
                              <SelectGroup>
                                <SelectLabel>Vendors</SelectLabel>
                                {transactionPartners.data.vendors.map((vd) => (
                                  <SelectItem key={vd.vdId} value={vd.vdId}>
                                    {vd.vdName} | Vendor
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="newData.tranAccTypeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-center justify-between">
                        <FormLabel>Account Type</FormLabel>
                      </div>
                      <FormControl>
                        {transactionPartners.isSuccess && (
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
              </div>
              <div className="flex flex-col">
                <FormField
                  name="newData.tranDescription"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Transaction Description</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Transaction Description"
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
              dialogTitle="You are about to update this transaction"
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
  );
}
