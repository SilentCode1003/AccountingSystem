import db from "../index";
import crypto from "crypto";
import inventory from "../schema/inventory.schema";
import { eq, sql } from "drizzle-orm";
import inventoryEntries from "../schema/inventoryEntries.schema";
import { editInventoryEntry } from "./inventoryEntries.service";

const INVENTORY_STATUS = {
  GOOD: "GOOD",
  WARNING: "WARNING",
  DEPLETED: "DEPLETED",
} as const;

type ObjectTypes<T> = T[keyof T];

type Inventoriestatus = ObjectTypes<typeof INVENTORY_STATUS>;

export const getAllInventories = async () => {
  const Inventories = await db.query.inventory.findMany();

  return Inventories;
};

export const addInventory = async (input: {
  invAssetName: string;
  invStatus: Inventoriestatus;
  invStocks: number;
  invPricePerUnit: number;
}) => {
  const newInventoryId = `invId ${crypto.randomUUID()}`;

  await db.insert(inventory).values({ ...input, invId: newInventoryId });

  const newInventory = await db.query.inventory.findFirst({
    where: (inventory) => eq(inventory.invId, newInventoryId),
  });

  return newInventory;
};

export const editInventory = async (input: {
  invId: string;
  newData: {
    invAssetName?: string;
    invStatus?: Inventoriestatus;
    invStocks?: number;
    invPricePerUnit?: number;
  };
}) => {
  const prevValues = await db.query.inventory.findFirst({
    where: (inv) => eq(inv.invId, input.invId),
  });

  await db
    .update(inventory)
    .set(input.newData)
    .where(eq(inventory.invId, input.invId));

  const editedInv = await db.query.inventory.findFirst({
    where: (inv) => eq(inv.invId, input.invId),
  });

  if (Number(prevValues?.invPricePerUnit) !== input.newData.invPricePerUnit) {
    const invEntriesId = await db.query.inventoryEntries.findMany({
      where: eq(inventoryEntries.invEntryInvId, input.invId),
    });

    await Promise.all(
      invEntriesId.map(async (invEntry) => {
        await editInventoryEntry({
          invEntryId: invEntry.invEntryId,
          invEntryTranId: invEntry.invEntryTranId,
          invEntryInvId: editedInv!.invId,
          invEntryQuantity: invEntry.invEntryQuantity,
          invEntryType: invEntry.invEntryType,
        });
      })
    );
  }
  return editedInv;
};
