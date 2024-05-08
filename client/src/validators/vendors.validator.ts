import { z } from 'zod'

export const createVendorSchema = z.object({
  vdName: z.string().min(1, { message: 'required' }),
  vdAddress: z.string().min(1, { message: 'required' }),
  vdContactInfo: z.string().min(1, { message: 'required' }),
  vdEmail: z.string().email().min(1, { message: 'required' }),
})

export const updateVendorSchema = z.object({
  vdId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'vdId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an vendor id.`,
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
    vdName: z.string().optional(),
    vdAddress: z.string().optional(),
    vdContactInfo: z.string().optional(),
    vdEmail: z.string().email().optional(),
  }),
})
