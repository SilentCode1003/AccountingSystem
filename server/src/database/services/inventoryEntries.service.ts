import { eq } from "drizzle-orm";
import db from "..";
import crypto from "crypto";
import inventoryEntries from "../schema/inventoryEntries.schema";
import tranTypes from "../schema/transactionTypes.schema";
import { addTransaction, editTransaction } from "./transactions.service";
import {
  addInventoryEntryProducts,
  editInventoryEntryProducts,
} from "./inventoryEntryProducts.service";
import { getInventoriesByIds } from "./inventory.service";

const INVENTORY_ENTRY_TYPE = {
  INCOMING: "INCOMING",
  OUTGOING: "OUTGOING",
} as const;

type ObjectTypes<T> = T[keyof T];

export type InventoryEntryType = ObjectTypes<typeof INVENTORY_ENTRY_TYPE>;

export const getAllInventoryEntries = async () => {
  const entries = await db.query.inventoryEntries.findMany({
    with: {
      inventoryEntryProducts: {
        with: { inventory: true },
      },
      transaction: { with: { account: { with: { accountType: true } } } },
      customer: true,
      vendor: true,
    },
  });
  return entries;
};

export const getInventoryEntryById = async (id: string) => {
  const entry = await db.query.inventoryEntries.findFirst({
    where: eq(inventoryEntries.invEntryId, id),
    with: {
      inventoryEntryProducts: {
        with: { inventory: true },
      },
      transaction: { with: { account: { with: { accountType: true } } } },
      customer: true,
      vendor: true,
    },
  });
  return entry;
};

export const addInventoryEntry = async (input: {
  invEntryDate: Date;
  invEntryPartner: string;
  invEntryType: InventoryEntryType;
  invEntryTranFileMimeType: string;
  iepProducts: Array<{
    iepInvId: string;
    iepQuantity: number;
  }>;
}) => {
  const newInventoryEntryId = `invEntryId ${crypto.randomUUID()}`;

  const inventories = await getInventoriesByIds(
    input.iepProducts.map((i) => i.iepInvId)
  );
  const invTotalPrice = inventories.reduce(
    (acc, i) =>
      acc +
      i.invPricePerUnit *
        input.iepProducts.find((p) => p.iepInvId === i.invId)!.iepQuantity,
    0
  );

  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(
      tranTypes.tranTypeName,
      input.invEntryType === "OUTGOING"
        ? "OUTGOING INVENTORY"
        : "INCOMING INVENTORY"
    ),
  });

  const newTransaction = await addTransaction({
    tranAccTypeId: transactionType!.tranTypeAccTypeId,
    tranAmount: invTotalPrice,
    tranDescription: "INVENTORY",
    tranPartner: input.invEntryPartner,
    tranTypeId: transactionType!.tranTypeId,
    tranFileMimeType: input.invEntryTranFileMimeType,
    tranTransactionDate: input.invEntryDate,
    tranAccName:
      input.invEntryType === "INCOMING" ? "BOUGHT INVENTORY" : "SOLD INVENTORY",
  });

  await db.insert(inventoryEntries).values({
    invEntryId: newInventoryEntryId,
    invEntryTotalPrice: invTotalPrice,
    invEntryTranId: newTransaction!.tranId,
    invEntryDate: input.invEntryDate,
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

  await addInventoryEntryProducts({
    iepInvEntryId: newInventoryEntryId,
    iepProducts: input.iepProducts,
    iepType: input.invEntryType,
  });

  const newInventoryEntry = await getInventoryEntryById(newInventoryEntryId);
  return newInventoryEntry;
};

export const editInventoryEntry = async (input: {
  invEntryId: string;
  invEntryTranId: string;
  invEntryDate?: Date;
  invEntryPartner?: string;
  invEntryTotalPrice?: number;
  invEntryType?: InventoryEntryType;
  iepProducts: Array<{
    iepInvId: string;
    iepQuantity: number;
  }>;
  invEntryTranFileMimeType?: string;
}) => {
  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(
      tranTypes.tranTypeName,
      input.invEntryType === "OUTGOING"
        ? "OUTGOING INVENTORY"
        : "INCOMING INVENTORY"
    ),
  });

  await editInventoryEntryProducts({
    iepInvEntryId: input.invEntryId,
    iepProducts: input.iepProducts,
    iepType: input.invEntryType,
  });

  // await db
  //   .update(inventoryEntries)
  //   .set({ ...input, invEntryTotalPrice: input.invEntryTotalPrice })
  //   .where(eq(inventoryEntries.invEntryId, input.invEntryId));

  await editTransaction({
    tranId: input.invEntryTranId,
    tranAccTypeId: transactionType!.tranTypeAccTypeId,
    tranAmount: input.invEntryTotalPrice,
    tranDescription: "INVENTORY",
    tranTypeId: transactionType!.tranTypeId,
    tranPartner: input.invEntryPartner!,
    tranFileMimeType: input.invEntryTranFileMimeType,
    tranTransactionDate: input.invEntryDate,
    tranAccName:
      input.invEntryType === "INCOMING" ? "BOUGHT INVENTORY" : "SOLD INVENTORY",
  });

  const updatedInventoryEntry = await getInventoryEntryById(input.invEntryId);
  return updatedInventoryEntry;
};
