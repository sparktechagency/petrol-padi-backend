import { Types } from "mongoose";

export interface INotification {
    toId : Types.ObjectId;
    title :string;
    // details: string;  
    isSeen: boolean;
}

export interface IAdminNotification {
    title :string;
    // details: string;  
    isSeen: boolean;
}

export type INotificationPayload = {
    toId?: string;   // optional field
    title: string;
};
