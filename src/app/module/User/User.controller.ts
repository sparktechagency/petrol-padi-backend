import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import { AuthRequest } from "../../../interface/authRequest";
import UserServices from "./User.service";
import { get } from "http";

const addLocation = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.addLocationService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Location added successfully.",
        data: result
    });
});

const addBankDetail = catchAsync(async (req, res) => {
     const { user } = req as AuthRequest;

    const result = await UserServices.addBankDetailService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bank detail added successfully.",
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.updateUserProfile(user ,req.file, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully.",
        data: result,
    });
});

const getUserProfile = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.getUserProfileService(user);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved profile successfully.",
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await UserServices.changePasswordService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully.",
        data: result,
    });
});

const UserController = { 
    addLocation,
    addBankDetail,
    updateProfile,
    getUserProfile,
    changePassword
 };
export default UserController;