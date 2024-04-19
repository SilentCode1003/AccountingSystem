import { z } from 'zod'

export const updateAccountSchema = z.object({
  accId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'accId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an account id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  newData: z.object({
    accTypeId: z.string().superRefine((val, ctx) => {
      if (val.split(' ')[0] !== 'accTypeId') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an account type id.`,
        })
      }
      if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid uuid.`,
        })
      }
    }),
    accName: z.string().optional(),
    accAmount: z
      .union([z.number(), z.nan()])
      .refine((val) => !Number.isNaN(val), {
        message: 'required',
      })
      .optional(),
    accDescription: z.string().optional(),
  }),
})
