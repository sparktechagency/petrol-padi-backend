import { Types } from "mongoose";

export interface IOrder {
    customer: Types.ObjectId ;
    supplier: Types.ObjectId ;
    status : string;
    fuelType: string;
    priceRate: number;
    quantity: number;
    totalPrice: number;
    location: string;
    latitude: string;
    longitude: string;
}