import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import CustomerServices from "./Customer.service";


const getprofileDetail = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;
    
    const result = await CustomerServices.getProfileDetailService(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Got profile detail.",
        data: result,
    });
});

// dashboard


const dashboardAllCustomer = catchAsync(async (req, res) => {
    
    const result: any = await CustomerServices.getAllCustomerService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all Customer",
        meta: result.meta,
        data: result.allCustomer,
    });
});

const dashboardSingleCustomer = catchAsync(async (req, res) => {
    
    const result = await CustomerServices.getSingleCustomerService(req.params.customerId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a Customer details",
        data: result,
    });
});

const blockUser = catchAsync(async (req, res) => {
    
    const result = await CustomerServices.blockUserService(req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a Customer details",
        data: result,
    });
});

const CustomerController = { 
    getprofileDetail,
    dashboardAllCustomer,
    dashboardSingleCustomer,
    blockUser
 };
export default CustomerController;