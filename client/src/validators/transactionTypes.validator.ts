import { z } from 'zod'

export const createTransactionTypeSchema = z.object({
  tranTypeName: z.string().refine((val) => val.length > 0, {
    message: 'required',
  }),
})

export const updateTransactionTypeSchema = z.object({
  tranTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'tranTypeId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction type id.`,
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
    tranTypeName: z.string().optional(),
  }),
})
