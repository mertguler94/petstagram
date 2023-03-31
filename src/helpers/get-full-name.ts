import { type User } from "@clerk/nextjs/dist/api";

export const getFullName = (userData: User | undefined) => {
  if (!userData || !userData.firstName || !userData.lastName) return "";

  return `${userData.firstName} ${userData.lastName}`;
};
