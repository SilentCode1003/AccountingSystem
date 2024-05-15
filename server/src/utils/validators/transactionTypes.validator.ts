import z from "zod";

export const createValidator = z.object({
  tranTypeName: z.string(),
  tranTypeAccTypeId: z.string().superRefine((val, ctx) => {
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
});

export const updateValidator = z.object({
  tranTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "tranTypeId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction type id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  newData: z.object({
    tranTypeName: z.optional(z.string()),
    tranTypeAccTypeId: z
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
  }),
});

export const toggleIsActiveValidator = z.object({
  tranTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "tranTypeId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction type id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
});
