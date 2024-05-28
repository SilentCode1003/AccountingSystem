import { Request, Response } from "express";
import { getForgetPasswordRequestById } from "../database/services/forgetPasswordRequests.service";

export const getSingleForgetPasswordRequestById = async (
  req: Request,
  res: Response
) => {
  try {
    const forgetPasswordRequest = await getForgetPasswordRequestById(
      req.params.id
    );
    if (!forgetPasswordRequest)
      return res
        .status(404)
        .send({ error: "Forget password request not found" });

    const difference =
      new Date().getTime() - forgetPasswordRequest.timeRequested.getTime();

    if (difference > 86400000) {
      return res
        .status(200)
        .send({ id: forgetPasswordRequest.id, remarks: "expired" });
    } else {
      return res
        .status(200)
        .send({ id: forgetPasswordRequest.id, remarks: "valid" });
    }
  } catch (error) {
    console.log("error in getting forget password request");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
