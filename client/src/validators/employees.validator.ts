import { z } from 'zod'

export const createEmployeeSchema = z.object({
  empId: z.string().min(1, { message: 'required' }),
  empName: z.string().min(1, { message: 'required' }),
  empContactInfo: z.string().min(1, { message: 'required' }),
  empJobStatus: z.string().min(1, { message: 'required' }),
  empPosition: z.string().min(1, { message: 'required' }),
  empDepartment: z.string().min(1, { message: 'required' }),
  empEmail: z.string().email().min(1, { message: 'required' }),
  empDateHired: z.date(),
  empSalary: z
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
})

export const updateEmployeeSchema = z.object({
  empId: z.string().min(1, { message: 'required' }),
  newData: z.object({
    empName: z.string().min(1, { message: 'required' }).optional(),
    empJobStatus: z.string().min(1, { message: 'required' }).optional(),
    empPosition: z.string().min(1, { message: 'required' }).optional(),
    empDepartment: z.string().min(1, { message: 'required' }).optional(),
    empContactInfo: z.string().min(1, { message: 'required' }).optional(),
    empEmail: z.string().min(1, { message: 'required' }).email().optional(),
    empDateHired: z.date().optional(),
    empDateTerminated: z.date().optional(),
    empSalary: z
      .union([
        z.number().positive({ message: 'must not be 0 or negative' }),
        z.nan(),
      ])
      .refine((val) => !Number.isNaN(val), {
        message: 'required',
      }),
  }),
})

export const terminateEmployeeSchema = z.object({
  empId: z.string(),
})
