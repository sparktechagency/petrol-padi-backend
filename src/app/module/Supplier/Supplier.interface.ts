import { Types } from "mongoose";

export interface ISupplier {
  user: Types.ObjectId;  
  name : string;
  email :string;
  phone : string;
  image :string;
  location: Object;
  address: string;
  // latitude : string;
  // longitude :string;
  document: string

  todayFuelRate : number;
  todayDieselRate : number;

  todayFuelLoad :number;
  previousDayFuelLoadRemain :number;
  todayCompletedFuelDelivery :number;
  todayReservedFuelForDelivery :number;
  todayFuelStock :number;

  todayDieselLoad :number;
  previousDayDieselLoadRemain :number;
  todayCompletedDieselDelivery :number;
  todayReservedDieselForDelivery :number;
  todayDieselStock :number;

  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankVerificationStatus?: boolean;

  totalRating: number;
  averageRating: number;

  isApproved: boolean;
  
}

export interface addFuelRate {
  todayFuelRate?: string ;
  todayDieselRate?: string;
  fuelType: string;
  profileId: string;
}