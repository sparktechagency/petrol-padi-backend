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