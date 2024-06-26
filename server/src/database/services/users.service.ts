import * as bcrypt from "bcryptjs";
import { eq, not } from "drizzle-orm";
import { DB } from "../index";
import users from "../schema/users.schema";

const USER_TYPE = {
  FINANCE: "FINANCE",
  HIGHER_DEPARTMENT: "HIGHER_DEPARTMENT",
} as const;

type ObjectTypes<T> = T[keyof T];

type UserType = ObjectTypes<typeof USER_TYPE>;

export const getAllUsers = async (db: DB) => {
  const users = await db.query.users.findMany();

  return users.map((user) => ({
    userId: user.userId,
    userUsername: user.userUsername,
    userContactNumber: user.userContactNumber,
    userProfilePic: user.userProfilePic,
    userFullName: user.userFullName,
    userIsActive: user.userIsActive,
  }));
};

export const getUserById = async (db: DB, input: { userId: string }) => {
  const userData = await db.query.users.findFirst({
    where: (user) => eq(user.userId, input.userId),
  });

  return {
    userUsername: userData?.userUsername,
    userContactNumber: userData?.userContactNumber,
    userProfilePic: userData?.userProfilePic,
    userFullName: userData?.userFullName,
    userEmail: userData?.userEmail,
  };
};

export const addUser = async (
  db: DB,
  input: { userType: UserType; empId: string }
) => {
  const emp = await db.query.employees.findFirst({
    where: (emp) => eq(emp.empId, input.empId),
  });

  const hashPassword = await bcrypt.hash(
    `${emp!.empId.split(" ")[1]}${emp!.empName!.split(" ")[0].toLowerCase()}`,
    10
  );

  const newUserId = `userId ${emp!.empId.split(" ")[1]}`;

  const checkUser = await db.query.users.findFirst({
    where: (user) => eq(user.userId, newUserId),
  });

  if (checkUser) throw new Error("User already exists");

  await db.insert(users).values({
    userId: newUserId,
    userEmail: emp!.empEmail,
    userContactNumber: emp!.empContactInfo,
    userFullName: emp!.empName!,
    userUsername: emp!.empId.split(" ")[1],
    userType: input.userType,
    userPassword: hashPassword,
  });

  const newUser = await db.query.users.findFirst({
    where: (user) => eq(user.userId, newUserId),
  });

  return {
    userId: newUser!.userId,
    userUsername: newUser!.userUsername,
    userContactNumber: newUser!.userContactNumber,
    userProfilePic: newUser!.userProfilePic,
    userFullName: newUser!.userFullName,
    userIsActive: newUser!.userIsActive,
  };
};

export const editUser = async (
  db: DB,
  input: {
    userId: string;
    newData: {
      userType?: UserType;
      userUsername?: string;
      userPassword?: string;
      userFullName?: string;
      userContactNumber?: string;
      userProfilePic?: string;
    };
  }
) => {
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
  return {
    userId: editedUser!.userId,
    userUsername: editedUser!.userUsername,
    userContactNumber: editedUser!.userContactNumber,
    userProfilePic: editedUser!.userProfilePic,
    userFullName: editedUser!.userFullName,
    userIsActive: editedUser!.userIsActive,
  };
};

export const toggleIsActive = async (db: DB, input: { userId: string }) => {
  await db
    .update(users)
    .set({ userIsActive: not(users.userIsActive) })
    .where(eq(users.userId, input.userId));

  const editedUser = await db.query.users.findFirst({
    where: (user) => eq(user.userId, input.userId),
  });

  return {
    userId: editedUser!.userId,
    userUsername: editedUser!.userUsername,
    userContactNumber: editedUser!.userContactNumber,
    userProfilePic: editedUser!.userProfilePic,
    userFullName: editedUser!.userFullName,
    userIsActive: editedUser!.userIsActive,
  };
};
