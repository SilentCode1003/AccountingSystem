import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import nodemailer from "nodemailer";
import path from "path";
import db from "../database";
import {
  addUser,
  editUser,
  getAllUsers,
  getUserById,
  toggleIsActive,
} from "../database/services/users.service";
import {
  changePasswordValidator,
  createValidator,
  forgetPasswordValidator,
  getByIdValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/users.validator";
import forgetPasswordRequests from "../database/schema/forgetPasswordRequests.schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import users from "../database/schema/users.schema";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.userId) return next();
  try {
    const users = await getAllUsers();
    console.log("successfully fetched all users");
    return res.status(200).send({
      users,
    });
  } catch (error) {
    console.log("error in fetching all users");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const getSingleUserById = async (req: Request, res: Response) => {
  const input = getByIdValidator.safeParse(req.query);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const user = await getUserById(input.data);
    console.log("successfully fetched single user");
    return res.status(200).send({
      user,
    });
  } catch (error) {
    console.log(
      "error in fetching single user with id: " + JSON.stringify(input.data)
    );
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });
  try {
    const newUser = await addUser(input.data);
    console.log("successfully created an user");
    return res.status(200).send({ user: newUser });
  } catch (error) {
    console.log("error creating an user");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  const userProfilePic = req.files
    ? (req.files!.userProfilePic as UploadedFile)
    : undefined;
  const input = updateValidator.safeParse({
    userId: req.body.userId,
    newData: {
      userUsername: req.body.userUsername,
      userFullName: req.body.userFullName,
      userPassword: req.body.userPassword,
      userContactNumber: req.body.userContactNumber,
      userProfilePic: undefined,
    },
  });
  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  if (userProfilePic) {
    userProfilePic?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/profilepic/users",
        `${input.data.newData.userUsername}.${
          userProfilePic.mimetype.split("/")[1]
        }`
      )
    );
  }

  try {
    const updatedUser = await editUser({
      userId: input.data.userId,
      newData: {
        userProfilePic:
          userProfilePic &&
          `${input.data.newData.userUsername}.${
            userProfilePic?.mimetype.split("/")[1]
          }`,
        userContactNumber: input.data.newData.userContactNumber,
        userFullName: input.data.newData.userFullName,
        userUsername: input.data.newData.userUsername,
        userPassword: input.data.newData.userPassword,
      },
    });
    console.log("successfully updated an user");
    return res.status(200).send({ user: updatedUser });
  } catch (error) {
    console.log("error updating an user");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const toggleUserIsActive = async (req: Request, res: Response) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedUser = await toggleIsActive(input.data);
    console.log("successfully toggled a user");
    return res.status(200).send({ user: updatedUser });
  } catch (error) {
    console.log("error toggling a user");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  console.log(req.body);
  const input = forgetPasswordValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.userUsername, input.data.userName),
    });

    if (!user) return res.status(404).send({ error: "User not found" });

    const checkIfExist = await db.query.forgetPasswordRequests.findFirst({
      where: eq(forgetPasswordRequests.userId, user.userId),
    });

    if (checkIfExist)
      await db
        .update(forgetPasswordRequests)
        .set({ timeRequested: new Date() })
        .where(eq(forgetPasswordRequests.userId, user.userId));
    else {
      await db.insert(forgetPasswordRequests).values({
        id: crypto.randomUUID(),
        userId: user.userId,
        timeRequested: new Date(),
      });
    }

    const passwordResetId = await db.query.forgetPasswordRequests.findFirst({
      where: eq(forgetPasswordRequests.userId, user.userId),
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        throw error;
      } else {
        console.log(success);
      }
    });

    transporter.sendMail(
      {
        from: "5L Accounting System <5lpos@5lsolutions.com>",
        to: user!.userEmail,
        subject: "Accounting System - Forget Password",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
        </head>
        <body>
        <div style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;text-align:center;">
        <div style="background-color:white;margin:10px auto;max-width:600px;">
            <div style="display:grid;justify-content:center;grid-template-columns:1fr;padding:40px;padding-bottom:0; ">
                <div>
                <img src="https://www.5lsolutions.com/wp-content/uploads/2023/03/FiveL-1.png" style="height:200px;width:200px;"> 
                </div>
                <h2 style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:24px;margin-bottom:0;"><strong>Accounting System</strong></h2>
                <h2 style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-weight:400;line-height:29.5px;">Password Reset Request</h2>
            </div>
            <div style="margin:auto;padding:48px;padding-top:0;text-align:left;">
                <figure class="table">
                    <table style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;vertical-align:top;" id="m_-7624050272238492021jussel" width="100%">
                        <tbody style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;padding:0;vertical-align:top;">
                            <tr style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;padding:0;vertical-align:top;">
                                <td style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;padding:0;vertical-align:top;" align="left">
                                    <p style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:16px;font-style:normal;font-weight:400;line-height:24px;margin:0;padding:0 0 20px;text-align:left;"><strong>Hello ${
                                      user.userFullName
                                    }!</strong></p>
                                    <p style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:16px;font-style:normal;font-weight:400;line-height:24px;margin:0;padding:0 0 20px;text-align:left;">Your account has requested a password reset. Below is the link for you to reset your password! Note that this link will expire in exactly 24 hrs after you have requested a password reset!</p>
                                    <p style="margin-left:0;"><a style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:16px;font-style:normal;font-weight:400;line-height:24px;text-align:center;" target="_blank" rel="noopener noreferrer" href="${
                                      process.env.CLIENT_URL
                                    }/forgotPassword/${passwordResetId!.id}">${
          process.env.CLIENT_URL
        }/forgotPassword/${passwordResetId!.id}</a></p>
                                    <figure class="table" style="width:100%;">
                                        <table style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0 0 24px;padding:0;vertical-align:top;">
                                            <tbody style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;padding:0;vertical-align:top;">
                                                <tr style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;padding:0;vertical-align:top;">
                                                    <td style="font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;margin:0;padding:0;vertical-align:top;" align="left">
                                                        <p style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:16px;font-style:normal;font-weight:400;line-height:24px;margin:0;padding:16px;text-align:center;"><a style="background-color:#f43f5e;color:#ffff;font-size:16px;font-style:normal;font-weight:500;letter-spacing:0.04em;line-height:24px;padding:16px;text-decoration:unset;" target="_blank" rel="noopener noreferrer" href="${
                                                          process.env.CLIENT_URL
                                                        }/forgotPassword/${
          passwordResetId!.id
        }">Reset Your Password!</a></p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </figure>
                                    <p style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:16px;font-style:normal;font-weight:400;line-height:24px;margin:0;padding:0 0 20px;text-align:left;"><strong>The link will expire within 24 hours.</strong></p>
                                    <p style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:14px;font-style:normal;font-weight:400;line-height:24px;margin:0;padding:0 0 20px;text-align:left;">If you did not request for this password reset request, please ignore this email.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </figure>
            </div>
        </div>
        <div style="color:#2d4f43;font-size:14px;font-style:normal;font-weight:400;line-height:24px;margin:10px auto;max-width:600px;text-align:center;">
            <p style="color:#2d4f43;font-family:'Rubik','Segoe UI',Tahoma,Geneva,Verdana,sans-serif!important;font-size:14px;font-style:normal;font-weight:400;line-height:24px;margin:24px 0;padding:0;text-align:center;">For any concerns, react out to the R&amp;D department.</p>
            <hr>
            <p style="color:#2d4f43;font-size:14px;font-style:normal;font-weight:400;line-height:24px;">Blk 1 Lot 57 Macaria Ave., Pacita Complex, Brgy. San Francisco, Biñan City, Laguna, Philippines</p>
            <div class="yj6qo">&nbsp;</div>
            <div class="adL">&nbsp;</div>
        </div>
        <div class="adL">&nbsp;</div>
    </div>
        </body>
        </html>
        `,
      },
      (error, info) => {
        if (error) {
          throw error;
        } else {
          console.log(info);
        }
      }
    );

    console.log("Password reset email sent successfully");
    return res.status(200).send({ message: "Email Sent Successfully!" });
  } catch (error) {
    console.log("error in password reset email");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const input = changePasswordValidator.safeParse(req.query);

  if (!input.success) return res.status(400).send({ error: input.error });

  try {
    const user = await getUserById({
      userId: input.data.userId,
    });

    if (!user) return res.status(404).send({ error: "User not found" });

    const checkRequest = await db.query.forgetPasswordRequests.findFirst({
      where: eq(forgetPasswordRequests.userId, input.data.userId),
    });

    if (!checkRequest)
      return res
        .status(404)
        .send({ error: "Password reset request not found" });

    const newPassword = await bcrypt.hash(input.data.newPassword, 10);

    await db
      .update(users)
      .set({ userPassword: newPassword })
      .where(eq(users.userId, input.data.userId));

    await db
      .delete(forgetPasswordRequests)
      .where(eq(forgetPasswordRequests.userId, input.data.userId));

    console.log("password changed successfully");
    return res.status(200).send({ user: user });
  } catch (error) {
    console.log("error in changing password");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
