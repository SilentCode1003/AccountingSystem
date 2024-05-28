import z from "zod";
import { type UploadedFile } from "express-fileupload";

//validator for POST /users inputs
export const createValidator = z.object({
  userType: z.enum(["FINANCE", "HIGHER_DEPARTMENT"]),
  empId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "empId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an employee id.`,
      });
    }
  }),
});

//validator for GET /users single user input
export const getByIdValidator = z.object({
  userId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "userId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a user id.`,
      });
    }
  }),
});

//validator for PUT /users inputs
export const updateValidator = z.object({
  userId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "userId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a user id.`,
      });
    }
  }),
  newData: z.object({
    userType: z.enum(["FINANCE", "HIGHER_DEPARTMENT"]).optional(),
    userUsername: z.string().optional(),
    userPassword: z.string().optional(),
    userFullName: z.string().optional(),
    userContactNumber: z.string().optional(),
    userProfilePic: z
      .custom<UploadedFile>()
      .refine(
        (file) => {
          if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
          )
            return true;
          return false;
        },
        {
          message: "Only PNG files are allowed",
        }
      )
      .transform((file) => file.name)
      .optional(),
  }),
});

//validator for PUT /users/:userId params
export const toggleIsActiveValidator = z.object({
  userId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "userId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a user id.`,
      });
    }
  }),
});

export const forgetPasswordValidator = z.object({
  userId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "userId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a user id.`,
      });
    }
  }),
});

export const changePasswordValidator = z.object({
  userId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "userId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a user id.`,
      });
    }
  }),
  newPassword: z.string().min(1, { message: "Password is required" }),
});
