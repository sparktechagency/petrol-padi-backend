import { Types } from "mongoose";

export interface ICustomer {
  user: Types.ObjectId;
  name : string;
  email : string;
  phone : string;
  image : string;
  location : Object;
  latitude : string;
  longitude : string;
  bankName :string;
  accountName :string;
  accountNumber: string;
}