
import ApiError from "../../../error/ApiError";
import { IReview } from "./Review.interface";
import ReviewModel from "./Review.model";
import mongoose from "mongoose";

const createReviewService = async ( payload: IReview) => {

    const review = await ReviewModel.create(payload);

    if(!review){
        throw new ApiError(500,"Failed to create new review.");
    }

    return review;
};


const getAllReviewService = async (query: Record<string,unknown>) => {

    const supplierId = query.supplierId as string;

    const supplier = new mongoose.Types.ObjectId(supplierId);

    const pipeline = [
        {
            $match: {
                supplier: supplier
            }
        },
        {
            $group: {
                _id: "$supplier",
                totalReviews: { $sum: 1 },
                averageRating: { $avg: "$rating" },
                starCounts: {
                    $push: "$rating"
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalReviews: 1,
                averageRating: { $round: ["$averageRating", 2] },
                starWise: {
                    "1_star": {
                        $size: {
                            $filter: {
                                input: "$starCounts",
                                as: "r",
                                cond: { $eq: ["$$r", 1] }
                            }
                        }
                    },
                    "2_star": {
                        $size: {
                            $filter: {
                                input: "$starCounts",
                                as: "r",
                                cond: { $eq: ["$$r", 2] }
                            }
                        }
                    },
                    "3_star": {
                        $size: {
                            $filter: {
                                input: "$starCounts",
                                as: "r",
                                cond: { $eq: ["$$r", 3] }
                            }
                        }
                    },
                    "4_star": {
                        $size: {
                            $filter: {
                                input: "$starCounts",
                                as: "r",
                                cond: { $eq: ["$$r", 4] }
                            }
                        }
                    },
                    "5_star": {
                        $size: {
                            $filter: {
                                input: "$starCounts",
                                as: "r",
                                cond: { $eq: ["$$r", 5] }
                            }
                        }
                    }
                }
            }
        }
    ];

    const [allReviews,result] = await Promise.all([
        ReviewModel.find({supplier: supplierId}).sort({createdAt: -1 }).lean(),
        ReviewModel.aggregate(pipeline)
    ]);

    

    return {allReviews,result};
};

const ReviewServices = { 
    createReviewService,
    getAllReviewService
 };
export default ReviewServices;