interface ICreateUser {
  email: string;
  name: string;
  mobile: number;
  password: string;
  profilePhoto: string;
  accountType: "CUSTOMER" | "SUPERADMIN";
}
