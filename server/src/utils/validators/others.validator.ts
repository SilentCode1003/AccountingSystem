import { selectAccountSchema } from "../../database/schema/accounts.schema";

//validator for POST /others/AccountTotal
export const AccountTotalValidator = selectAccountSchema.pick({
  accType: true,
  accCreatedAt: true,
});
