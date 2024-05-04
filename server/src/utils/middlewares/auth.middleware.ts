import { NextFunction, Request, Response } from "express";
import z from "zod";
import { getAksById } from "../../database/services/apiKeyStore.service";
import { getUserById } from "../../database/services/users.service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId)
    return res.status(401).send({ error: "Login First!" });

  try {
    const checkUser = await getUserById({
      userId: req.session.userId as string,
    });
    if (!checkUser) return res.status(404).send({ error: "Not authorized" });

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = z
    .object({
      apiKey: z.string(),
    })
    .safeParse({
      apiKey: req.headers["x-api-key"],
    });

  if (!input.success)
    return res.status(400).send({ error: "Invalid API Key!" });

  const aksId = input.data.apiKey.slice(0, 16);
  const hashedKey = input.data.apiKey.slice(16);

  const aks = await getAksById(aksId);

  if (!aks) return res.status(400).send({ error: "API key does not exist!" });

  if (aks.aksHashedKey !== hashedKey)
    return res.status(400).send({ error: "API key do not match!" });

  return next();
};
