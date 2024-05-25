import db from "../index";
import crypto from "crypto";
import inventory from "../schema/inventory.schema";
import { eq, sql } from "drizzle-orm";
import inventoryEntries from "../schema/inventoryEntries.schema";
import { editInventoryEntry } from "./inventoryEntries.service";
import { inArray } from "drizzle-orm";
import inventoryEntryProducts from "../schema/inventoryEntriesProducts.schema";
import { editInventoryEntryProducts } from "./inventoryEntryProducts.service";

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

export const getInventoriesByIds = async (invIds: string[]) => {
  const inventories = await db.query.inventory.findMany({
    where: inArray(inventory.invId, invIds),
  });
  return inventories;
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
    const iepIds = await db.query.inventoryEntryProducts.findMany({
      where: eq(inventoryEntryProducts.iepInvId, input.invId),
    });
    let iepArr: Array<string> = [];
    await Promise.all(
      iepIds.map(async (iep) => {
        iepArr.push(iep.iepInvEntryId);
        await db
          .update(inventoryEntryProducts)
          .set({
            iepTotalPrice: iep.iepQuantity * input.newData.invPricePerUnit!,
          })
          .where(eq(inventoryEntryProducts.iepId, iep.iepId));
      })
    );
    const updatedIep = await db.query.inventoryEntryProducts.findMany({
      where: eq(inventoryEntryProducts.iepInvId, input.invId),
    });

    await Promise.all(
      Array.from(new Set(iepArr)).map(async (invEntry) => {
        const origInvEntry = await db.query.inventoryEntries.findFirst({
          where: eq(inventoryEntries.invEntryId, invEntry),
        });
        const products = await db.query.inventoryEntryProducts.findMany({
          where: eq(inventoryEntryProducts.iepInvEntryId, invEntry),
        });
        await editInventoryEntry({
          invEntryId: origInvEntry!.invEntryId,
          invEntryPartner: (origInvEntry!.invEntryCustId ??
            origInvEntry!.invEntryVdId)!,
          invEntryTranId: origInvEntry!.invEntryTranId,
          iepProducts: products.map((p) => ({
            iepInvId: p.iepInvId,
            iepQuantity: p.iepQuantity,
          })),
        });
      })
    );
  }
  return editedInv;
};
