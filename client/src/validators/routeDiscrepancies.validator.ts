import { z } from 'zod'

export const toggleRouteDiscrepancySchema = z.object({
  routeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'rdId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an route discrepancy id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
})
