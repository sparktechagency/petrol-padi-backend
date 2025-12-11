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

// dashboard

const getAllSupplier = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.getAllSupplierService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all supplier.",
        data: result,
    });
});

const getAllSupplierRequest = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.getSupplierRequestService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all supplier request.",
        data: result,
    });
});

const getSupplierDetails = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.getSupplierDetailsService(req.params.supplierId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a supplier detail.",
        data: result,
    });
});

const approveSupplier = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.approveSupplierService(req.params.supplierId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Supplier approved successfully.",
        data: result,
    });
});

const deleteSupplier = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.deleteSupplierService(req.params.supplierId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Deleted a supplier successfully.",
        data: result,
    });
});

const SupplierController = {
    findLowestHighestFuelRate,
    supplierDetails,
    addFuelRate,
    getFuelRate,
    getAllSupplier,
    getAllSupplierRequest,
    getSupplierDetails,
    approveSupplier,
    deleteSupplier
};
export default SupplierController;