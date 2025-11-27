import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import UserServices from "./User.service";

const addLocation = catchAsync(async (req, res) => {

    const result = await UserServices.addLocationService(req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Location added successfully.",
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {

    const result = await UserServices.updateUserProfile(req.user ,req.file, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully.",
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {

    const result = await UserServices.changePasswordService(req.user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully.",
        data: result,
    });
});

const UserController = { 
    addLocation,
    updateProfile,
    changePassword
 };
export default UserController;