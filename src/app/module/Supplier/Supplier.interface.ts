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

  todayFuelRate : number;
  todayDieselRate : number;

  todayFuelLoad :number;
  previousFuelLoadRemain :number;
  todayReservedFuelDelivery :number;
  todayCompletedFuelDelivery :number;
  todayFuelStock :number;

  todayDieselLoad :number;
  previousDieselLoadRemain :number;
  todayReservedDieselDelivery :number;
  todayCompletedDieselDelivery :number;
  todayDieselStock :number;

  bankName: string;
  accountName: string;
  accountNumber: string;
  
}

export interface addFuelRate {
  todayFuelRate: string ;
  todayDieselRate : string;
  fuelType: string;
  profileId: string;
}