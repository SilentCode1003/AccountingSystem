import db from "../index";
import crypto from "crypto";
import users from "../schema/users.schema";
import { eq, not } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

const USER_TYPE = {
  FINANCE: "FINANCE",
  HIGHER_DEPARTMENT: "HIGHER_DEPARTMENT",
} as const;

type ObjectTypes<T> = T[keyof T];

type UserType = ObjectTypes<typeof USER_TYPE>;

export const getAllUsers = async () => {
  const users = await db.query.users.findMany();

  return users;
};

export const getUserById = async (input: { userId: string }) => {
  const userData = await db.query.users.findFirst({
    where: (user) => eq(user.userId, input.userId),
  });

  return {
    userUsername: userData?.userUsername,
    userContactNumber: userData?.userContactNumber,
    userProfilePic: userData?.userProfilePic,
    userFullName: userData?.userFullName,
  };
};

export const addUser = async (input: {
  userType: UserType;
  userUsername: string;
  userPassword: string;
  userFullName: string;
  userContactNumber: string;
  userProfilePic: string;
}) => {
  const newUserId = `userId ${crypto.randomUUID()}`;

  const hashPassword = await bcrypt.hash(input.userPassword, 10);

  await db
    .insert(users)
    .values({ ...input, userId: newUserId, userPassword: hashPassword });

  const newUser = await db.query.users.findFirst({
    where: (user) => eq(user.userId, newUserId),
  });

  return newUser;
};

export const editUser = async (input: {
  userId: string;
  newData: {
    userType?: UserType;
    userUsername?: string;
    userPassword?: string;
    userFullName?: string;
    userContactNumber?: string;
    userProfilePic?: string;
  };
}) => {
  if (input.newData.userPassword) {
    const hashPassword = await bcrypt.hash(input.newData.userPassword, 10);
    await db
      .update(users)
      .set({ ...input.newData, userPassword: hashPassword })
      .where(eq(users.userId, input.userId));
  } else {
    await db
      .update(users)
      .set({ ...input.newData })
      .where(eq(users.userId, input.userId));
  }

  const editedUser = await db.query.users.findFirst({
    where: (user) => eq(user.userId, input.userId),
  });

  return editedUser;
};

export const toggleIsActive = async (input: { userId: string }) => {
  await db
    .update(users)
    .set({ userIsActive: not(users.userIsActive) })
    .where(eq(users.userId, input.userId));

  const updatedUser = await db.query.users.findFirst({
    where: (user) => eq(user.userId, input.userId),
  });

  return updatedUser;
};
