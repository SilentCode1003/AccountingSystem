import { and, eq, sql, sum } from "drizzle-orm";
import db from "..";
import crypto from "crypto";
import accounts from "../schema/accounts.schema";
import modesOfPayment from "../schema/modeOfPayment";
import { not } from "drizzle-orm";

export const getAllModesOfPayment = async () => {
  const modeOfPayments = await db.query.modesOfPayment.findMany({
    with: {
      transactions: true,
    },
  });
  return modeOfPayments;
};

export const getModeOfPaymentById = async (input: { mopId: string }) => {
  const modeOfPayment = await db.query.modesOfPayment.findFirst({
    where: (mop) => eq(mop.mopId, input.mopId),
    with: {
      transactions: true,
    },
  });
  return modeOfPayment;
};

export const addModeOfPayment = async (input: { mopName: string }) => {
  const newModeOfPaymentId = `mopId ${crypto.randomUUID()}`;
  await db.insert(modesOfPayment).values({
    mopId: newModeOfPaymentId,
    mopName: input.mopName,
  });

  const newModeOfPayment = await getModeOfPaymentById({
    mopId: newModeOfPaymentId,
  });
  return newModeOfPayment;
};

export const editModeOfPayment = async (input: {
  mopId: string;
  newData: {
    mopName?: string;
  };
}) => {
  await db
    .update(modesOfPayment)
    .set(input.newData)
    .where(eq(modesOfPayment.mopId, input.mopId));
  const updatedModeOfPayment = await getModeOfPaymentById({
    mopId: input.mopId,
  });

  return updatedModeOfPayment;
};

export const changeModeOfPaymentIsActive = async (input: { mopId: string }) => {
  await db
    .update(modesOfPayment)
    .set({
      mopIsActive: not(modesOfPayment.mopIsActive),
    })
    .where(eq(modesOfPayment.mopId, input.mopId));
  const editedModeOfPayment = await getModeOfPaymentById(input);
  return editedModeOfPayment;
};
