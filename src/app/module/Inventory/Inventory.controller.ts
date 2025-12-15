import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import { IInventoryQuery } from "./Inventory.interface";
import InventoryServices from "./Inventory.service";

const todayLoadFuel = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await InventoryServices.loadFuelService(user,req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fuel loaded successfully",
        data: result,
    });
});

const getLoadedFuel = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await InventoryServices.getLoadedFuelService(user);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const filterInventory = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await InventoryServices.filterInventoryService(user,req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Inventory filtered",
        data: result,
    });
});

const InventoryController = { 
    todayLoadFuel,
    getLoadedFuel,
    filterInventory
 };
export default InventoryController;