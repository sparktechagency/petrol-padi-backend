import express from "express";
import auth from "../../middlewares/auth";
// import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./User.validation";
import UserController from "./User.controller";
import { uploadProfile } from "../../../helper/multerUpload";
// import { uploadFile } from "../../helper/fileUploader";

const userRouter = express.Router();

userRouter.post("/add-location",
    validateRequest(UserValidations.addLocationValidation),
    UserController.addLocation
);

userRouter.patch("/update-profile",
    //authorization([USER_ROLE.USER]),
    uploadProfile.single('profile-image'),
    validateRequest(UserValidations.updateprofileValidation),
    UserController.updateProfile
);

userRouter.patch("/change-password",
    //authorization([USER_ROLE.USER]),
    // uploadProfile.single('profile-image'),
    validateRequest(UserValidations.changePasswordValidation),
    UserController.changePassword
);


export default userRouter;