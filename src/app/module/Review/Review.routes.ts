import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ReviewValidations from "./Review.validation";
import ReviewController from "./Review.controller";


const reviewRouter = express.Router();

reviewRouter.post("/create-new-review",
        //auth,
        validateRequest(ReviewValidations.createReviewValidation),
        ReviewController.createReview
);

reviewRouter.get("/get-all-review",
        //auth,
        // validateRequest(ReviewValidations.getAllReviewValidation),
        ReviewController.getAllReview
);

export default reviewRouter;