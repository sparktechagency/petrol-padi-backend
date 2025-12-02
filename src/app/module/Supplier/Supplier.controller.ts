import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import SupplierServices from "./Supplier.service";

const findLowestHighestFuelRate = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.findLowestHighestFuelRateService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved lowest and highest rate of fuel price today.",
        data: result,
    });
});

const supplierDetails = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.supplierDetailService(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a supplier details",
        data: result,
    });
});

const addFuelRate = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.addFuelRateService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Today's rate updated successfully",
        data: result,
    });
});

const getFuelRate = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.getFuelRateService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved fuel rate",
        data: result,
    });
});

const SupplierController = {
    findLowestHighestFuelRate,
    supplierDetails,
    addFuelRate,
    getFuelRate,
};
export default SupplierController;