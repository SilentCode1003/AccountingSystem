import crypto from "crypto";
import { eq, not } from "drizzle-orm";
import modesOfPayment from "../schema/modeOfPayment";
import { DB } from "..";

export const getAllModesOfPayment = async (db: DB) => {
  const modeOfPayments = await db.query.modesOfPayment.findMany({
    with: {
      transactions: true,
    },
  });
  return modeOfPayments;
};

export const getModeOfPaymentById = async (
  db: DB,
  input: { mopId: string }
) => {
  const modeOfPayment = await db.query.modesOfPayment.findFirst({
    where: (mop) => eq(mop.mopId, input.mopId),
    with: {
      transactions: true,
    },
  });
  return modeOfPayment;
};

export const addModeOfPayment = async (db: DB, input: { mopName: string }) => {
  const newModeOfPaymentId = `mopId ${crypto.randomUUID()}`;
  await db.insert(modesOfPayment).values({
    mopId: newModeOfPaymentId,
    mopName: input.mopName,
  });

  const newModeOfPayment = await getModeOfPaymentById(db, {
    mopId: newModeOfPaymentId,
  });
  return newModeOfPayment;
};

export const editModeOfPayment = async (
  db: DB,
  input: {
    mopId: string;
    newData: {
      mopName?: string;
    };
  }
) => {
  await db
    .update(modesOfPayment)
    .set(input.newData)
    .where(eq(modesOfPayment.mopId, input.mopId));
  const updatedModeOfPayment = await getModeOfPaymentById(db, {
    mopId: input.mopId,
  });

  return updatedModeOfPayment;
};

export const changeModeOfPaymentIsActive = async (
  db: DB,
  input: { mopId: string }
) => {
  await db
    .update(modesOfPayment)
    .set({
      mopIsActive: not(modesOfPayment.mopIsActive),
    })
    .where(eq(modesOfPayment.mopId, input.mopId));
  const editedModeOfPayment = await getModeOfPaymentById(db, input);
  return editedModeOfPayment;
};
