import express from "express";
import {auth,authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./User.validation";
import UserController from "./User.controller";
import { uploadProfile } from "../../../helper/multerUpload";


const userRouter = express.Router();

userRouter.post("/add-location",
    auth(["Supplier","Customer"]),
    validateRequest(UserValidations.addLocationValidation),
    UserController.addLocation
);

userRouter.patch("/update-profile",
    auth(["Supplier","Customer"]),
    uploadProfile.single('profile-image'),
    validateRequest(UserValidations.updateprofileValidation),
    UserController.updateProfile
);

userRouter.get("/get-profile-detail",
    authorizeUser,
    UserController.getUserProfile
);

userRouter.patch("/change-password",
    authorizeUser,
    validateRequest(UserValidations.changePasswordValidation),
    UserController.changePassword
);

userRouter.post("/add-bank-details",
    authorizeUser,
    validateRequest(UserValidations.addBankDetailValidation),
    UserController.addBankDetail
);


export default userRouter;