import { Router } from "express";
import { checkApiKey } from "../utils/middlewares/auth.middleware";
import { approveCheque } from "../controller/cheques.controller";
import { generateNewApiKey } from "../controller/apiKeyStore.controller";

const apiRouter = Router();

//generate new API key
apiRouter.post("/aks", generateNewApiKey);

//increase cheque approval count
apiRouter.put("/:chqId", checkApiKey, approveCheque);

export default apiRouter;
