export interface ICreateUser {
  email: string;
  name: string;
  mobile: number;
  password: string;
  profilePhoto: string;
  accountType: "CUSTOMER" | "SUPERADMIN";
}

export interface IUpdateShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface IUpdatePaymentMethod {
  type: string;
}
