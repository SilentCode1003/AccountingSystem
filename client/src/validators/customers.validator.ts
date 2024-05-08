import { z } from 'zod'

export const createCustomerSchema = z.object({
  custName: z.string().min(1, { message: 'required' }),
  custAddress: z.string().min(1, { message: 'required' }),
  custContactInfo: z.string().min(1, { message: 'required' }),
  custEmail: z.string().email().min(1, { message: 'required' }),
})

export const updateCustomersSchema = z.object({
  custId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'custId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an customer id.`,
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
    custName: z.string().optional(),
    custAddress: z.string().optional(),
    custContactInfo: z.string().optional(),
    custEmail: z.string().email().optional(),
  }),
})
