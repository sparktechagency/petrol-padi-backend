import { Types } from "mongoose";

export interface IInventory {
    supplier: Types.ObjectId;

    todayFuelLoad: number;
    remainingFuelPreviousDay: number;
    todayAvailableFuel: number;
    todayFuelDelivery: number;
    todayFuelRevenue: number;

    todayDieselLoad: number;
    remainingDieselPreviousDay: number;
    todayDieselDelivery: number;
    todayAvailableDiesel: number;
    todayDieselRevenue: number;
}

export interface ILoadFuel {
  todayFuelLoad?: string ;
  todayDieselLoad?: string;
  fuelType: string;
  profileId: string;
}