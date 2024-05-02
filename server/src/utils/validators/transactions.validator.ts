import { UploadedFile } from "express-fileupload";
import z from "zod";

//validator for POST /transactions inputs
export const createValidator = z.object({
  tranDescription: z.string(),
  tranAmount: z.coerce.number(),
  tranAccTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "accTypeId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an account type id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  tranPartner: z.string().superRefine((val, ctx) => {
    if (val === "")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      });
    if (
      val.split(" ")[0] !== "empId" &&
      val.split(" ")[0] !== "custId" &&
      val.split(" ")[0] !== "vdId"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid employee/customer/vendor id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  tranTransactionDate: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  tranFile: z.custom<UploadedFile>().refine(
    (file) => {
      if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        return true;
      return false;
    },
    {
      message: "Only xlsx files are allowed",
    }
  ),
});

//validator for PUT /transactions inputs
export const updateValidator = z.object({
  tranId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "tranId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  tranAccId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(" ")[0] !== "accId") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an account id.`,
        });
      }
      if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid uuid.`,
        });
      }
    })
    .optional(),
  tranDescription: z.string().optional(),
  tranAccTypeId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(" ")[0] !== "accTypeId") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an account type id.`,
        });
      }
      if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid uuid.`,
        });
      }
    })
    .optional(),
  tranAmount: z.coerce.number().optional(),
  tranPartner: z
    .string()
    .superRefine((val, ctx) => {
      if (val === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
        });
      if (
        val.split(" ")[0] !== "empId" &&
        val.split(" ")[0] !== "custId" &&
        val.split(" ")[0] !== "vdId"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid employee/customer/vendor id.`,
        });
      }
      if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid uuid.`,
        });
      }
    })
    .optional(),
  tranTransactionDate: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
  tranFile: z
    .custom<UploadedFile>()
    .refine(
      (file) => {
        if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
          return true;
        return false;
      },
      {
        message: "Only xlsx files are allowed",
      }
    )
    .optional(),
});

export const createTransactionByFileValidator = z.object({
  tranFile: z.custom<UploadedFile>().refine(
    (file) => {
      if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        return true;
      return false;
    },
    {
      message: "Only xlsx files are allowed",
    }
  ),
});
