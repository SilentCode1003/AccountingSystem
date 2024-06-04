import { Request, Response } from "express";
import z from "zod";
import { generateAks } from "../database/services/apiKeyStore.service";
import db from "../database";

export const generateNewApiKey = async (req: Request, res: Response) => {
  const input = z.string().safeParse(req.body.userName);

  if (!input.success)
    return res.status(400).send({ error: input.error.message });

  const newApiKey = await generateAks(db, {
    aksUserName: input.data,
  });

  return res.send({ apiKey: newApiKey });
};
