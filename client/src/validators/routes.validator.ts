import z from 'zod'

export const updateRouteSchema = z.object({
  routeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'routeId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an route id.`,
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
    routeStart: z.string().optional(),
    routeEnd: z.string().optional(),
    routePrice: z
      .union([
        z.number().positive({ message: 'must not be 0 or negative' }),
        z.nan(),
      ])
      .refine((val) => !Number.isNaN(val), {
        message: 'required',
      }),
    routeModeOfTransport: z.string().optional(),
  }),
})

export const deleteRouteSchema = z.object({
  routeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'routeId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an routeid.`,
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
