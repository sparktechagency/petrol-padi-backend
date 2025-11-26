import { Types } from "mongoose";

export interface IAuth {
    
    name?: string;
    phone?: string;
    email: string;
    address?: string;
    profile_image?: string;
    totalAmount?: number;
    totalPoint?: number;
}

export interface TLoginUser {
    email: string;
    password: string;
}