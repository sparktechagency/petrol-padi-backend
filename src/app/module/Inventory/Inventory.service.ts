import ApiError from "../../../error/ApiError";
import { IInventory, ILoadFuel } from "./Inventory.interface";
import InventoryModel from "./Inventory.model";
import { ENUM_FUEL_TYPE } from "../../../utilities/enum";
import SupplierModel from "../Supplier/Supplier.model";
import mongoose from "mongoose";


const loadFuelService = async (payload: ILoadFuel) => {
    const {todayFuelLoad, todayDieselLoad, fuelType, profileId} = payload;

    let supplier;

    if(fuelType === ENUM_FUEL_TYPE.FUEL){
        supplier = await SupplierModel.findByIdAndUpdate(profileId,{
            todayFuelLoad: todayFuelLoad
        },{new: true});
    }
    else if(fuelType === ENUM_FUEL_TYPE.DIESEL){
        supplier = await SupplierModel.findByIdAndUpdate(profileId,{
            todayDieselLoad: todayDieselLoad
        },{new: true});
    }

    if(!supplier){
        throw new ApiError(500,"Failed to load fuel");
    }

    return null;
    
}

const getLoadedFuelService = async (query: Record<string,unknown>) => {
    const profileId = query.profileId as string;

    const mongooseProfileId = new mongoose.Types.ObjectId(profileId);

    const supplier = await SupplierModel.aggregate([
        {
            $match: {_id: mongooseProfileId}
        },
        {
            $project:{
                _id: 1,
                name: 1,
                email: 1,
                todayFuelLoad: 1,
                previousDayFuelLoadRemain: 1,
                todayCompletedFuelDelivery: 1,
                todayReservedFuelForDelivery: 1,
                todayFuelStock: 1,

                todayDieselLoad: 1,
                previousDayDieselLoadRemain: 1,
                todayCompletedDieselDelivery: 1,
                todayReservedDieselForDelivery: 1,
                todayDieselStock: 1,
            }
        }
    ]);

    return supplier;

}


//generate inventory for every supplier at everyday night
//this service function is getting called from cronHelper.ts file
export const generateDailyInventoryService = async (): Promise<void> => {
  try {
    // Fetch all suppliers (only fields needed)
    const suppliers = await SupplierModel.find({}, {
      _id: 1,

      todayFuelLoad: 1,
      previousDayFuelLoadRemain: 1,
      todayFuelStock: 1,
      todayCompletedFuelDelivery: 1,
      todayReservedFuelForDelivery: 1,
      todayFuelRate: 1,

      todayDieselLoad: 1,
      previousDayDieselLoadRemain: 1,
      todayDieselStock: 1,
      todayCompletedDieselDelivery: 1,
      todayReservedDieselForDelivery: 1,
      todayDieselRate: 1,
    });

    if (!suppliers.length) {
      console.log("No suppliers found for daily inventory generation.");
      return;
    }

    const inventoryDocs =  suppliers.map((supplier) => {

      const fuelRevenue = supplier.todayCompletedFuelDelivery * (supplier.todayFuelRate || 0);

      const dieselRevenue = supplier.todayCompletedDieselDelivery * (supplier.todayDieselRate || 0);

      return {
        supplier: supplier._id,

        // Fuel fields
        todayFuelLoad: supplier.todayFuelLoad,
        remainingFuelPreviousDay: supplier.previousDayFuelLoadRemain,
        todayAvailableFuel: supplier.todayFuelStock,
        todayFuelDelivery: supplier.todayCompletedFuelDelivery,
        todayFuelRevenue: fuelRevenue,

        // Diesel fields
        todayDieselLoad: supplier.todayDieselLoad,
        remainingDieselPreviousDay: supplier.previousDayDieselLoadRemain,
        todayAvailableDiesel: supplier.todayDieselStock,
        todayDieselDelivery: supplier.todayCompletedDieselDelivery,
        todayDieselRevenue: dieselRevenue,
      };
    });

    // Insert all inventory records at once (bulk write)
    await InventoryModel.insertMany(inventoryDocs);

    console.log(`Successfully generated inventory for ${suppliers.length} suppliers.`);

  } catch (error) {
    console.error("Daily inventory generation error:", error);
    throw new ApiError(500, "Failed to generate daily inventory.");
  }
};


// Auto-resetting supplier "today" fields after inventory generationreset
export const resetSupplierDailyFieldsService = async (): Promise<void> => {
  try {

    const suppliers = await SupplierModel.find({}, {
      todayFuelStock: 1,
      todayFuelRate: 1,
      todayDieselStock: 1,
      todayDieselRate: 1,
    });

    if (!suppliers.length) {
      console.log("No suppliers found for daily reset.");
      return;
    }

    const bulkOps = suppliers.map((supplier) => {
      return {
        updateOne: {
          filter: { _id: supplier._id },
          update: {
            $set: {
              // Fuel reset
              previousDayFuelLoadRemain: supplier.todayFuelStock,
              todayFuelLoad: 0,
              todayCompletedFuelDelivery: 0,
              todayReservedFuelForDelivery: 0,
              todayFuelStock: supplier.todayFuelStock,
              todayFuelRate: supplier.todayFuelRate,

              // Diesel reset
              previousDayDieselLoadRemain: supplier.todayDieselStock,
              todayDieselLoad: 0,
              todayCompletedDieselDelivery: 0,
              todayReservedDieselForDelivery: 0,
              todayDieselStock: supplier.todayDieselStock,
              todayDieselRate: supplier.todayDieselRate,
            }
          }
        }
      };
    });

    await SupplierModel.bulkWrite(bulkOps);

    console.log("All supplier daily fields successfully reset.");

  } catch (error) {
    console.error("Supplier daily reset error:", error);
    throw new ApiError(500, "Failed to reset supplier daily fields.");
  }
};


const InventoryServices = { 
    loadFuelService,
    getLoadedFuelService,
    // generateDailyInventoryService
 };
export default InventoryServices;