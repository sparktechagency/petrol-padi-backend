import { Types } from "mongoose";

export interface IUser {
    profile: Types.ObjectId;
    name :string;
    email :string;
    password :string;
    phone : string;
    // image :string;
    // location: string;
    role :string,
    verificationCode: string;
    isBlockd : boolean;
    isEmailVerified: boolean;
}

export interface IAddLocation {
    location: string,
    role: string,
    userId: string
    // latitude?: string,
    // longitude?: string,
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}