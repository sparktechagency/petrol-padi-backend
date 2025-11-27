import { Types } from "mongoose";

export interface ISupplier {
  user: Types.ObjectId;  
  name : string;
  email :string;
  phone : string;
  image :string;
  location: string;
  latitude : string;
  longitude :string;
  todayRate : number;
  todayFuelLoad :number;
  previousLoadRemain :number;
  todayCompletedDelivery :number;
  todayReservedDelivery :number;
  fuelStock :number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  
}