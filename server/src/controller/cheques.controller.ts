import { Request, Response } from "express";
import {
  addCheque,
  editCheque,
  getAllCheques,
  getChequeById,
  incrementChequeApproval,
  setChequeStatus,
} from "../database/services/cheques.service";
import {
  approveChequeValidator,
  createValidator,
  updateValidator,
} from "../utils/validators/cheques.validator";
import path from "path";

export const getCheques = async (req: Request, res: Response) => {
  try {
    const cheques = await getAllCheques();
    return res.status(200).send({ cheques });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
export const createCheque = async (req: Request, res: Response) => {
  const input = createValidator.safeParse({
    ...req.body,
    chqFile: req.files!.chqFile,
    chqAmount: parseFloat(req.body.chqAmount),
  });

  if (!input.success) return res.status(400).send({ error: input.error });

  try {
    const newCheque = await addCheque({
      ...input.data,
      chqTranFileMimeType:
        input.data.chqFile &&
        input.data.chqFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.chqFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newCheque?.chqTranId}.${
          input.data.chqFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );

    return res.status(200).send({ cheque: newCheque });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateCheque = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);
  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedChq = await editCheque({
      ...input.data,
    });

    return res.status(200).send({ cheque: updatedChq });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};

export const approveCheque = async (req: Request, res: Response) => {
  const input = approveChequeValidator.safeParse(req.params);

  if (!input.success) return res.status(400).send({ error: "invalid inputs" });
  try {
    const chq = await getChequeById(input.data.chqId);

    if (!chq) return res.status(404).send({ error: "Cheque not found" });

    if (chq.chqStatus === "APPROVED")
      return res.status(200).send({ cheque: chq });

    const incrementedChq = await incrementChequeApproval(input.data.chqId);

    if (incrementedChq!.chqApprovalCount >= 3) {
      const updatedChq = await setChequeStatus(input.data.chqId, "APPROVED");
      return res.status(200).send({ cheque: updatedChq });
    }
    return res.status(200).send({ cheque: incrementedChq });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
