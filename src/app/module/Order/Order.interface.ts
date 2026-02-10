import { Types } from "mongoose";

export interface IOrder {
    customer: Types.ObjectId ;
    supplier: Types.ObjectId ;
    status : string;
    paymentStatus: string;
    paymentReference: string;
    // fuelType: string;
    fuelPriceRate: number;
    dieselPriceRate: number;
    fuelQuantity: number;
    dieselQuantity: number;
    fuelPrice: number;
    dieselPrice: number;
    totalPrice: number;
    location: string;
    latitude: string;
    longitude: string;
}