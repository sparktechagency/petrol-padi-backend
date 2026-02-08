import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import SupplierServices from "./Supplier.service";

const findLowestHighestFuelRate = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.findNearbySuppliersWithRateStats(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved lowest and highest rate of fuel price today.",
        data: result,
    });
});

const searchSupplierByName = catchAsync(async (req, res) => {
    
    const result = await SupplierServices.searchSupplierByNameService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all suppliers matching the name.",
        data: result,
    });
});

const supplierDetails = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;
    
    const result = await SupplierServices.supplierDetailService(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a supplier details",
        data: result,
    });
});

const addFuelRate = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;
    
    const result = await SupplierServices.addFuelRateService(user,req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Today's rate updated successfully",
        data: result,
    });
});

const getFuelRate = catchAsync(async (req, res) => {
    
     const { user } = req as AuthRequest;
     
    const result = await SupplierServices.getFuelRateService(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved fuel rate",
        data: result,
    });
});

const uploadDocument = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await SupplierServices.uploadDocumentService(user,req.file);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Document added successfully.",
        data: result,
    });
});

const supplierRevenue = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await SupplierServices.supplierRevenueService(user,req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved supplier revenue data.",
        data: result,
    });
});

// dashboard

const getAllSupplier = catchAsync(async (req, res) => {
    
    const result: any = await SupplierServices.getAllSupplierService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all supplier.",
        meta: result.meta,
        data: result.allSupplier,
    });
});

const getAllSupplierRequest = catchAsync(async (req, res) => {
    
    const result: any = await SupplierServices.getSupplierRequestService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all supplier request.",
        meta: result.meta,
        data: result.allSupplier,
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
    searchSupplierByName,
    supplierDetails,
    addFuelRate,
    getFuelRate,
    uploadDocument,
    supplierRevenue,
    getAllSupplier,
    getAllSupplierRequest,
    getSupplierDetails,
    approveSupplier,
    deleteSupplier
};
export default SupplierController;