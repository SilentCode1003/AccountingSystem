import z from "zod";

//validator for PUT /route input
export const updateValidator = z.object({
  routeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "routeId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an route id.`,
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
    routeStart: z.string().optional(),
    routeEnd: z.string().optional(),
    routePrice: z.number().optional(),
    routeModeOfTransport: z.string().optional(),
  }),
});

//validator for DELETE /route input
export const deleteValidator = z.object({
  routeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "routeId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an route id.`,
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
