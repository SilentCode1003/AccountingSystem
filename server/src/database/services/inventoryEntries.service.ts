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
  invEntryMopId: string;
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
    tranMopId: input.invEntryMopId,
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
  invEntryType?: InventoryEntryType;
  iepProducts: Array<{
    iepInvId: string;
    iepQuantity: number;
  }>;
  invEntryTranFileMimeType?: string;
  invEntryMopId?: string;
}) => {
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

  const prevInvEntry = await getInventoryEntryById(input.invEntryId);

  await editInventoryEntryProducts({
    iepInvEntryId: input.invEntryId,
    iepProducts: input.iepProducts,
    prevInvEntryType: prevInvEntry!.invEntryType,
    iepType: input.invEntryType,
  });

  await db
    .update(inventoryEntries)
    .set({
      ...input,
      invEntryTotalPrice: invTotalPrice,
      invEntryCustId:
        input.invEntryPartner!.split(" ")[0] === "custId"
          ? input.invEntryPartner
          : null,
      invEntryVdId:
        input.invEntryPartner!.split(" ")[0] === "vdId"
          ? input.invEntryPartner
          : null,
    })
    .where(eq(inventoryEntries.invEntryId, input.invEntryId));

  await editTransaction({
    tranId: input.invEntryTranId,
    tranAccTypeId: transactionType!.tranTypeAccTypeId,
    tranAmount: invTotalPrice,
    tranDescription: "INVENTORY",
    tranTypeId: transactionType!.tranTypeId,
    tranPartner: input.invEntryPartner!,
    tranFileMimeType: input.invEntryTranFileMimeType,
    tranTransactionDate: input.invEntryDate,
    tranAccName:
      input.invEntryType === "INCOMING" ? "BOUGHT INVENTORY" : "SOLD INVENTORY",
    tranMopId: input.invEntryMopId,
  });

  const updatedInventoryEntry = await getInventoryEntryById(input.invEntryId);
  return updatedInventoryEntry;
};
