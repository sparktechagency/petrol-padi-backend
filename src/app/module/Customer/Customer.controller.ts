import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import CustomerServices from "./Customer.service";


// dashboard

const dashboardAllCustomer = catchAsync(async (req, res) => {
    
    const result = await CustomerServices.getAllCustomerService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all Customer",
        data: result,
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
    dashboardAllCustomer,
    dashboardSingleCustomer,
    blockUser
 };
export default CustomerController;