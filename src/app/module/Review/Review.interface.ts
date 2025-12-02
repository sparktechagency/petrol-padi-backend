import { Types } from "mongoose";

export interface IReview {
    supplier: Types.ObjectId;
    reviewerName :string;
    rating: number;
    description: string;
}