import db from "../index";
import crypto from "crypto";
import customers from "../schema/customers.schema";
import { eq, not } from "drizzle-orm";

export const getAllCustomers = async () => {
  const customers = await db.query.customers.findMany();

  return customers;
};

export const getCustomerByName = async (custName: string) => {
  const customer = await db.query.customers.findFirst({
    where: (customer) => eq(customer.custName, custName),
  });

  return customer;
};

export const addCustomer = async (input: {
  custName: string;
  custContactInfo: string;
  custAddress: string;
  custEmail: string;
}) => {
  const newCustomerId = `custId ${crypto.randomUUID()}`;

  await db.insert(customers).values({ ...input, custId: newCustomerId });

  const newCustomer = await db.query.customers.findFirst({
    where: (customer) => eq(customer.custId, newCustomerId),
  });

  return newCustomer;
};

export const editCustomer = async (input: {
  custId: string;
  newData: {
    custName?: string;
    custContactInfo?: string;
    custAddress?: string;
    custEmail?: string;
    custIsActive?: boolean;
  };
}) => {
  await db
    .update(customers)
    .set(input.newData)
    .where(eq(customers.custId, input.custId));

  const updatedCust = await db.query.customers.findFirst({
    where: (cust) => eq(cust.custId, input.custId),
  });

  return updatedCust;
};

export const updateCustomerIsActive = async (input: { custId: string }) => {
  await db
    .update(customers)
    .set({ custIsActive: not(customers.custIsActive) })
    .where(eq(customers.custId, input.custId));

  const updatedCust = await db.query.customers.findFirst({
    where: (cust) => eq(cust.custId, input.custId),
  });

  return updatedCust;
};
