import db from "../index";
import cheques from "../schema/cheques.schema";
import { eq } from "drizzle-orm";
import { addAccount } from "./accounts.service";
import accounts from "../schema/accounts.schema";

const CHEQUE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

type ObjectTypes<T> = T[keyof T];

type ChequeStatus = ObjectTypes<typeof CHEQUE_STATUS>;

export const getAllCheques = async () => {
  const cheques = await db.query.cheques.findMany({
    with: { account: { with: { accountType: true } } },
  });

  return cheques;
};

export const getChequeById = async (chqId: string) => {
  const cheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { account: { with: { accountType: true } } },
  });

  return cheque;
};

export const addCheque = async (input: {
  chqPayeeName: string;
  chqAmount: number;
  chqIssueDate: Date;
  chqStatus: ChequeStatus;
  chqAccTypeId: string;
}) => {
  const account = await addAccount({
    accName: "CASH",
    accAmount: input.chqAmount,
    accDescription: "CHEQUE",
    accTypeId: input.chqAccTypeId,
  });

  const newChqId = `chqId ${crypto.randomUUID()}`;

  await db
    .insert(cheques)
    .values({ ...input, chqAccId: account!.accId, chqId: newChqId });

  const newCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, newChqId),
    with: { account: { with: { accountType: true } } },
  });

  return newCheque;
};

export const editCheque = async (input: {
  chqId: string;
  newData: {
    chqPayeeName?: string;
    chqAmount?: number;
    chqIssueDate?: Date;
    chqStatus?: ChequeStatus;
    chqAccTypeId: string;
  };
  chqAccId: string;
}) => {
  await db
    .update(accounts)
    .set({ accTypeId: input.newData.chqAccTypeId })
    .where(eq(accounts.accId, input.chqAccId));

  await db
    .update(cheques)
    .set({
      chqAmount: input.newData.chqAmount,
      chqIssueDate: input.newData.chqIssueDate,
      chqPayeeName: input.newData.chqPayeeName,
      chqStatus: input.newData.chqStatus,
      chqUpdatedAt: new Date(),
    })
    .where(eq(cheques.chqId, input.chqId));

  const updatedChq = await db.query.cheques.findFirst({
    where: (chq) => eq(chq.chqId, input.chqId),
    with: { account: { with: { accountType: true } } },
  });

  return updatedChq;
};
