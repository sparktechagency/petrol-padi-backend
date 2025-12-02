import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import ReviewServices from "./Review.service";

const createReview = catchAsync(async (req, res) => {

    const result = await ReviewServices.createReviewService(req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const getAllReview = catchAsync(async (req, res) => {

    const result = await ReviewServices.getAllReviewService(req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const ReviewController = { 
    createReview,
    getAllReview
 };
export default ReviewController;