import { api } from "./api";

export const getUserById = (id: string) => {
  return api.get(`/users/${id}`);
};