import crypto from "crypto";
import { desc, eq } from "drizzle-orm";
import { DB } from "..";
import budgets from "../schema/Budget.schema";

export const getAllBudgets = async (db: DB) => {
  const allBudgets = await db.query.budgets.findMany({
    with: {
      employee: true,
    },
    orderBy: [desc(budgets.budgetDate)],
  });
  return allBudgets;
};

export const getBudgetById = async (db: DB, id: string) => {
  const budget = await db.query.budgets.findFirst({
    where: eq(budgets.budgetId, id),
    with: {
      employee: true,
    },
  });
  return budget;
};

export const addBudget = async (
  db: DB,
  input: {
    budgetEmpId: string;
    budgetAmount: number;
    budgetDate: Date;
    budgetTranId: string;
  }
) => {
  const newBudgetId = `budgetId ${crypto.randomUUID()}`;
  await db.insert(budgets).values({
    ...input,
    budgetId: newBudgetId,
  });

  const newBudget = await getBudgetById(db, newBudgetId);
  return newBudget;
};

// export const editInventoryEntryProducts = async (input: {
//   iepInvEntryId: string;
//   iepType?: string;
//   prevInvEntryType: string;
//   iepProducts: Array<{
//     iepInvId: string;
//     iepQuantity: number;
//   }>;
// }) => {
//   const previousProducts = await db.query.inventoryEntryProducts.findMany({
//     where: eq(inventoryEntryProducts.iepInvEntryId, input.iepInvEntryId),
//   });

//   await db
//     .delete(inventoryEntryProducts)
//     .where(eq(inventoryEntryProducts.iepInvEntryId, input.iepInvEntryId));

//   await Promise.all(
//     previousProducts.map(async (product) => {
//       const inv = await db.query.inventory.findFirst({
//         where: (inventory) => eq(inventory.invId, product.iepInvId),
//       });

//       if (
//         input.prevInvEntryType !== input.iepType ||
//         !input.iepProducts.find((p) => p.iepInvId === product.iepInvId)
//       )
//         await db
//           .update(inventory)
//           .set({
//             invStocks:
//               input.iepType === "INCOMING"
//                 ? inv!.invStocks + product.iepQuantity
//                 : inv!.invStocks - product.iepQuantity,
//           })
//           .where(eq(inventory.invId, product.iepInvId));
//       if (!input.iepProducts.find((p) => p.iepInvId === product.iepInvId))
//         return;
//       if (
//         product.iepQuantity !==
//         input.iepProducts.find((p) => p.iepInvId === product.iepInvId)!
//           .iepQuantity
//       )
//         await db
//           .update(inventory)
//           .set({
//             invStocks:
//               input.iepType === "INCOMING"
//                 ? inv!.invStocks - product.iepQuantity
//                 : inv!.invStocks + product.iepQuantity,
//           })
//           .where(eq(inventory.invId, product.iepInvId));
//     })
//   );

//   const errors: Array<String> = [];

//   await Promise.all(
//     input.iepProducts.map(async (product) => {
//       const newInventoryEntryProductId = `iepId ${crypto.randomUUID()}`;
//       const inv = await db.query.inventory.findFirst({
//         where: (inventory) => eq(inventory.invId, product.iepInvId),
//       });

//       await db.insert(inventoryEntryProducts).values({
//         iepId: newInventoryEntryProductId,
//         iepInvEntryId: input.iepInvEntryId,
//         iepInvId: product.iepInvId,
//         iepQuantity: product.iepQuantity,
//         iepTotalPrice: product.iepQuantity * inv!.invPricePerUnit,
//       });

//       const updatedStocks =
//         input.iepType === "INCOMING"
//           ? inv!.invStocks + product.iepQuantity
//           : inv!.invStocks - product.iepQuantity;

//       if (inv!.invStocks < product.iepQuantity && input.iepType === "OUTGOING")
//         errors.push(inv?.invAssetName as string);
//       else {
//         if (
//           input.iepType !== input.prevInvEntryType ||
//           (!isEqual(
//             sortBy(input.iepProducts, (p) => p.iepInvId),
//             sortBy(
//               previousProducts.map((p) => ({
//                 iepInvId: p.iepInvId,
//                 iepQuantity: p.iepQuantity,
//               })),
//               (p) => p.iepInvId
//             )
//           ) &&
//             previousProducts.find((p) => p.iepInvId === product.iepInvId)
//               ?.iepQuantity !== product.iepQuantity)
//         )
//           await db
//             .update(inventory)
//             .set({
//               invStocks: updatedStocks,
//             })
//             .where(eq(inventory.invId, product.iepInvId));
//       }
//     })
//   );

//   if (errors.length > 0)
//     throw new Error(`Not enough stocks for ${errors.join(", ")}`);

//   const newInventoryEntryProducts =
//     await db.query.inventoryEntryProducts.findMany({
//       where: eq(inventoryEntryProducts.iepInvEntryId, input.iepInvEntryId),
//     });

//   return {
//     ...newInventoryEntryProducts,
//     totalPrice: newInventoryEntryProducts.reduce(
//       (acc, curr) => acc + curr.iepTotalPrice,
//       0
//     ),
//   } as typeof newInventoryEntryProducts & { totalPrice: number };
// };

// export const deleteInventoryEntryProducts = async (input: {
//   iepId: string;
// }) => {
//   await db
//     .delete(inventoryEntryProducts)
//     .where(eq(inventoryEntryProducts.iepId, input.iepId));
// };
