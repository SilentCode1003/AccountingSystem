import z from "zod";

//validator for POST /accounts input
export const createValidator = z.object({
  accTypeId: z.string().superRefine((val, ctx) => {
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
  accName: z.string(),
  accDescription: z.string(),
  accAmount: z.number(),
});

//validator for PUT /accounts input
export const updateValidator = z.object({
  accId: z.string().superRefine((val, ctx) => {
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
  }),
  newData: z.object({
    accTypeId: z.string().superRefine((val, ctx) => {
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
    accName: z.string().optional(),
    accDescription: z.optional(z.string()),
    accAmount: z.optional(z.number()),
  }),
});

//validator for PUT /accounts/:accId params
export const toggleIsActiveValidator = z.object({
  accId: z.string().superRefine((val, ctx) => {
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
  }),
});
