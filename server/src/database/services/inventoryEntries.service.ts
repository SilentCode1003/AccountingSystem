import { eq } from "drizzle-orm";
import db from "..";
import inventoryEntries from "../schema/inventoryEntries.schema";
import { addTransaction, editTransaction } from "./transactions.service";
import tranTypes from "../schema/transactionTypes.schema";
import accountTypes from "../schema/accountType.schema";
import inventory from "../schema/inventory.schema";
import { getAccountTypeById } from "./accountType.service";

const INVENTORY_ENTRY_TYPE = {
  INCOMING: "INCOMING",
  OUTGOING: "OUTGOING",
} as const;

type ObjectTypes<T> = T[keyof T];

export type InventoryEntryType = ObjectTypes<typeof INVENTORY_ENTRY_TYPE>;

export const getAllInventoryEntries = async () => {
  const entries = await db.query.inventoryEntries.findMany({
    with: {
      inventory: true,
    },
  });
  return entries;
};

export const getInventoryEntryById = async (id: string) => {
  const entry = await db.query.inventoryEntries.findFirst({
    where: eq(inventoryEntries.invEntryId, id),
    with: {
      inventory: true,
    },
  });
  return entry;
};

export const addInventoryEntry = async (input: {
  invEntryInvId: string;
  invEntryQuantity: number;
  invEntryDate: Date;
  invEntryPartner: string;
  invEntryType: InventoryEntryType;
  invEntryTranFileMimeType: string;
}) => {
  const newInventoryEntryId = `invEntryId ${crypto.randomUUID()}`;

  const inv = await db.query.inventory.findFirst({
    where: (inventory) => eq(inventory.invId, input.invEntryInvId),
  });

  if (inv!.invStocks < input.invEntryQuantity)
    throw new Error("Not enough stocks");

  const InvEntryTotalPrice =
    parseFloat(String(inv!.invPricePerUnit)) * input.invEntryQuantity;

  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(tranTypes.tranTypeName, "INVENTORY"),
  });

  const accountType = await db.query.accountTypes.findFirst({
    where: eq(
      accountTypes.accTypeName,
      input.invEntryType === "INCOMING" ? "EXPENSE" : "REVENUE"
    ),
  });

  const newTransaction = await addTransaction({
    tranAccTypeId: accountType!.accTypeId,
    tranAmount: inv!.invPricePerUnit * input.invEntryQuantity,
    tranDescription: "INVENTORY",
    tranPartner: input.invEntryPartner,
    tranTypeId: transactionType!.tranTypeId,
    tranFileMimeType: input.invEntryTranFileMimeType,
    tranTransactionDate: input.invEntryDate,
  });

  await db.insert(inventoryEntries).values({
    invEntryId: newInventoryEntryId,
    invEntryTotalPrice: InvEntryTotalPrice,
    invEntryTranId: newTransaction!.tranId,
    invEntryDate: input.invEntryDate,
    invEntryInvId: input.invEntryInvId,
    invEntryQuantity: input.invEntryQuantity,
    invEntryType: input.invEntryType,
    invEntryCustId:
      input.invEntryPartner.split(" ")[0] === "custId"
        ? input.invEntryPartner
        : null,
    invEntryVdId:
      input.invEntryPartner.split(" ")[0] === "vdId"
        ? input.invEntryPartner
        : null,
  });

  await db
    .update(inventory)
    .set({
      invStocks:
        input.invEntryType === "INCOMING"
          ? inv!.invStocks + input.invEntryQuantity
          : inv!.invStocks - input.invEntryQuantity,
    })
    .where(eq(inventory.invId, input.invEntryInvId));

  const newInventoryEntry = await db.query.inventoryEntries.findFirst({
    where: (inventoryEntry) =>
      eq(inventoryEntry.invEntryId, newInventoryEntryId),
  });
  return newInventoryEntry;
};

export const editInventoryEntry = async (input: {
  invEntryId: string;
  invEntryInvId: string;
  invEntryQuantity?: number;
  invEntryDate?: Date;
  invEntryPartner?: string;
  invEntryTranId: string;
  invEntryType?: InventoryEntryType;
  invEntryTranFileMimeType?: string;
}) => {
  const inv = await db.query.inventory.findFirst({
    where: eq(inventory.invId, input.invEntryInvId),
  });

  const accountType = await db.query.accountTypes.findFirst({
    where: eq(
      accountTypes.accTypeName,
      input.invEntryType === "INCOMING" ? "EXPENSE" : "REVENUE"
    ),
  });

  await db
    .update(inventoryEntries)
    .set(input)
    .where(eq(inventoryEntries.invEntryId, input.invEntryId));

  await editTransaction({
    tranId: input.invEntryTranId,
    tranAccTypeId: accountType!.accTypeId,
    tranAmount: inv!.invPricePerUnit * input.invEntryQuantity!,
    tranDescription: "INVENTORY",
    tranPartner: input.invEntryPartner!,
    tranFileMimeType: input.invEntryTranFileMimeType,
    tranTransactionDate: input.invEntryDate,
  });

  const updatedInventoryEntry = await getInventoryEntryById(input.invEntryId);
  return updatedInventoryEntry;
};
