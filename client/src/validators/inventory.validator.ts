import { z } from 'zod'

export const createInventorySchema = z
  .object({
    invAssetName: z.string().min(1, { message: 'Required' }),
    invStocks: z.number().min(1, { message: 'Required' }),
    invStatus: z.enum(['GOOD', 'WARNING', 'DEPLETED']),
  })
  .required()

export const updateFormSchema = z.object({
  invId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'invId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory id.`,
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
    invAssetName: z.string().optional(),
    invStocks: z.number().optional(),
    invStatus: z.enum(['GOOD', 'WARNING', 'DEPLETED']).optional(),
  }),
})
