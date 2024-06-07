import { Request, Response } from "express";
import db from "../database";
import {
  editRoute,
  getAllRoutes,
  removeRoute,
} from "../database/services/routes.service";
import {
  deleteValidator,
  updateValidator,
} from "../utils/validators/routes.validator";

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await getAllRoutes(db);
    console.log("successfully fetched all routes");
    return res.status(200).send({
      routes,
    });
  } catch (error) {
    console.log("error in fetching all routes");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const editedRoute = await editRoute(db, input.data);
    console.log("successfully updated an route");
    return res.status(200).send({ route: editedRoute });
  } catch (error) {
    console.log("error updating an route");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  const input = deleteValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const deletedRoute = await removeRoute(db, input.data);
    console.log("successfully deleted an route");
    return res.status(200).send({ ...deletedRoute });
  } catch (error) {
    console.log("error deleting an route");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
// export const toggleRouteIsActive = async (req: Request, res: Response) => {
//   const input = toggleIsActiveValidator.safeParse(req.params);

//   if (!input.success)
//     return res.status(400).send({
//       error: input.error.errors[0].message,
//     });

//   try {
//     const editedRoute = await updateRouteIsActive(db, input.data);

//     console.log("successfully updated an route");

//     return res.status(200).send({
//       route: editedRoute,
//     });
//   } catch (error) {
//     console.log("error updating an route");
//     console.log(error);
//     return res.status(500).send({ error: "Server error" });
//   }
// };
