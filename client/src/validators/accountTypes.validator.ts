import { z } from 'zod'

export const createAccountTypeSchema = z.object({
  accTypeName: z.string(),
  accTypeDefault: z.string().optional(),
})

export const updateAccountTypeSchema = z.object({
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
  newData: z.object({
    accTypeName: z.string().optional(),
    accTypeDefault: z.string().optional(),
  }),
})
