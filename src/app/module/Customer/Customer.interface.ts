import { Types } from "mongoose";

export interface ICustomer {
  user: Types.ObjectId;
  name : string;
  email : string;
  phone : string;
  image : string;
  location : string;
}