import { z } from 'zod'

export const createModeOfPaymentSchema = z.object({
  mopName: z.string().refine((val) => val.length > 0, {
    message: 'required',
  }),
})

export const updateModeOfPaymentSchema = z.object({
  mopId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'mopId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an mode of payment id.`,
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
    mopName: z.string().optional(),
  }),
})
