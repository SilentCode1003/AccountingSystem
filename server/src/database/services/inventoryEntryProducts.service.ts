import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "..";
import inventoryEntryProducts from "../schema/inventoryEntriesProducts.schema";
import inventory from "../schema/inventory.schema";
import { and } from "drizzle-orm";

const INVENTORY_ENTRY_TYPE = {
  INCOMING: "INCOMING",
  OUTGOING: "OUTGOING",
} as const;

type ObjectTypes<T> = T[keyof T];

export type InventoryEntryType = ObjectTypes<typeof INVENTORY_ENTRY_TYPE>;

export const getAllInventoryEntryProducts = async () => {
  const products = await db.query.inventoryEntryProducts.findMany({
    with: {
      inventoryEntry: true,
      inventory: true,
    },
  });
  return products;
};

// export const getInventoryEntryById = async (id: string) => {
//   const entry = await db.query.inventoryEntries.findFirst({
//     where: eq(inventoryEntries.invEntryId, id),
//     with: {
//       transaction: { with: { account: { with: { accountType: true } } } },
//       customer: true,
//       vendor: true,
//     },
//   });
//   return entry;
// };

export const addInventoryEntryProducts = async (input: {
  iepInvEntryId: string;
  iepType?: string;
  iepProducts: Array<{
    iepInvId: string;
    iepQuantity: number;
  }>;
}) => {
  await Promise.all(
    input.iepProducts.map(async (product) => {
      const newInventoryEntryProductId = `iepId ${crypto.randomUUID()}`;

      const inv = await db.query.inventory.findFirst({
        where: (inventory) => eq(inventory.invId, product.iepInvId),
      });
      await db.insert(inventoryEntryProducts).values({
        iepId: newInventoryEntryProductId,
        iepInvEntryId: input.iepInvEntryId,
        iepInvId: product.iepInvId,
        iepQuantity: product.iepQuantity,
        iepTotalPrice: product.iepQuantity * inv!.invPricePerUnit,
      });

      if (input.iepType) {
        await db
          .update(inventory)
          .set({
            invStocks:
              input.iepType === "INCOMING"
                ? inv!.invStocks + product.iepQuantity
                : inv!.invStocks - product.iepQuantity,
          })
          .where(eq(inventory.invId, product.iepInvId));
      }
    })
  );

  const newInventoryEntryProducts =
    await db.query.inventoryEntryProducts.findMany({
      where: eq(inventoryEntryProducts.iepInvEntryId, input.iepInvEntryId),
    });

  return {
    ...newInventoryEntryProducts,
    totalPrice: newInventoryEntryProducts.reduce(
      (acc, curr) => acc + curr.iepTotalPrice,
      0
    ),
  } as typeof newInventoryEntryProducts & { totalPrice: number };

  //   return newInventoryEntryProductId;
};

export const editInventoryEntryProducts = async (input: {
  iepInvEntryId: string;
  iepType?: string;
  iepProducts: Array<{
    iepInvId: string;
    iepQuantity: number;
  }>;
}) => {
  await Promise.all(
    input.iepProducts.map(async (product) => {
      const inv = await db.query.inventory.findFirst({
        where: (inventory) => eq(inventory.invId, product.iepInvId),
      });

      const prevInvProduct = await db.query.inventoryEntryProducts.findFirst({
        where: (iep) =>
          and(
            eq(iep.iepInvEntryId, input.iepInvEntryId),
            eq(iep.iepInvId, product.iepInvId)
          ),
      });

      await db
        .update(inventoryEntryProducts)
        .set({
          ...product,
          iepTotalPrice: product.iepQuantity * inv!.invPricePerUnit,
        })
        .where(
          and(
            eq(inventoryEntryProducts.iepInvEntryId, input.iepInvEntryId),
            eq(inventoryEntryProducts.iepInvId, product.iepInvId)
          )
        );

      if (input.iepType) {
        await db
          .update(inventory)
          .set({
            invStocks:
              input.iepType === "INCOMING"
                ? inv!.invStocks +
                  (product.iepQuantity - prevInvProduct!.iepQuantity)
                : inv!.invStocks -
                  (product.iepQuantity - prevInvProduct!.iepQuantity),
          })
          .where(eq(inventory.invId, product.iepInvId));
      }
    })
  );

  const newInventoryEntryProducts =
    await db.query.inventoryEntryProducts.findMany({
      where: eq(inventoryEntryProducts.iepInvEntryId, input.iepInvEntryId),
    });

  return {
    ...newInventoryEntryProducts,
    totalPrice: newInventoryEntryProducts.reduce(
      (acc, curr) => acc + curr.iepTotalPrice,
      0
    ),
  } as typeof newInventoryEntryProducts & { totalPrice: number };
};

export const deleteInventoryEntryProducts = async (input: {
  iepId: string;
}) => {
  await db
    .delete(inventoryEntryProducts)
    .where(eq(inventoryEntryProducts.iepId, input.iepId));
};
