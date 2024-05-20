import z from "zod";

//validator for POST /employees input
export const createValidator = z.object({
  empId: z.string(),
  empName: z.string(),
  empContactInfo: z.string(),
  empJobStatus: z.string(),
  empDepartment: z.string(),
  empPosition: z.string(),
  empEmail: z.string().email(),
  empDateHired: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  empSalary: z.number(),
});

//validator for PUT /employees input
export const updateValidator = z.object({
  empId: z.string(),
  newData: z.object({
    empName: z.string().optional(),
    empContactInfo: z.string().optional(),
    empEmail: z.string().email().optional(),
    empJobStatus: z.string().optional(),
    empDepartment: z.string().optional(),
    empPosition: z.string().optional(),
    empDateHired: z
      .string()
      .datetime()
      .transform((date) => new Date(date))
      .optional(),
    empDateTerminated: z
      .string()
      .datetime()
      .transform((date) => new Date(date))
      .optional(),
    empSalary: z.number().optional(),
  }),
});

//validator for PUT /employees/:empId params
export const terminateEmpValidator = z.object({
  empId: z.string(),
});
