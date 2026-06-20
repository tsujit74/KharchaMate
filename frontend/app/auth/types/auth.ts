export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type LoginData = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
  mobile?: string;
};

export type AuthMode = "login" | "signup";