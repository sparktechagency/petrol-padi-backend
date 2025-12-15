import mongoose from "mongoose";
import ApiError from "../../../error/ApiError";
import { IInventory, ILoadFuel,IInventoryQuery } from "./Inventory.interface";
import InventoryModel from "./Inventory.model";
import { ENUM_FUEL_TYPE } from "../../../utilities/enum";
import SupplierModel from "../Supplier/Supplier.model";
import { JwtPayload } from "jsonwebtoken";
import { ISupplier } from "../Supplier/Supplier.interface";


const loadFuelService = async (userDetails: JwtPayload,payload: ILoadFuel) => {
    const {profileId} = userDetails;

    const {todayFuelLoad, todayDieselLoad, fuelType} = payload;

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

    return {
      name: supplier.name, 
      todayFuelLoad: supplier.todayFuelLoad,
      todayDieselLoad: supplier.todayDieselLoad,
    };
    
}

const getLoadedFuelService = async (userDetails: JwtPayload) => {
    const { profileId } = userDetails; 

    //const {fuelType} = payload;

    const mongooseProfileId = new mongoose.Types.ObjectId(profileId);

    const supplier: ISupplier | any = await SupplierModel.aggregate([
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

    // if(fuelType === ENUM_FUEL_TYPE.FUEL){
    //   return {
    //       _id: supplier._id,
    //       name: supplier.name,
    //       email: supplier.email,
    //       todayFuelLoad: supplier.todayFuelLoad,
    //       previousDayFuelLoadRemain: supplier.previousDayFuelLoadRemaining,
    //       todayCompletedFuelDelivery: supplier.todayCompletedFuelDelivery,
    //       todayReservedFuelForDelivery: supplier.todayReservedFuelForDelivery,
    //       todayFuelStock: supplier.todayFuelStock,
    //   }
    // }

    return supplier;

}



const filterInventoryService = async (userDetails: JwtPayload,query: Record<string,unknown>) => {
  const {profileId} = userDetails
  const { fuelType, time} = query;

  const supplier = new mongoose.Types.ObjectId(profileId);

  // -------------------------------
  // 1️⃣ TIME RANGE CALCULATION
  // -------------------------------

  const now = new Date();
  let startDate: Date;

  switch (time) {

    case "this-week":
      const day = now.getDay();          // 0 = Sunday
      const diff = now.getDate() - day;  
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      break;
    
    case "this-month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    
    case "this-year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;

    default:
      throw new ApiError(400,"Invaid time.");

    }

  const matchStage = {
    supplier: supplier,
    createdAt: { $gte: startDate, $lte: now }
  };

  // ---------------------------------
  // 2️⃣ FIELD SELECTION BASED ON FUEL TYPE
  // ---------------------------------

  const fieldMap = fuelType === "Fuel"
    ? {
        load: "$todayFuelLoad",
        remaining: "$remainingFuelPreviousDay",
        available: "$todayAvailableFuel",
        delivery: "$todayFuelDelivery",
        revenue: "$todayFuelRevenue",
      }
    : {
        load: "$todayDieselLoad",
        remaining: "$remainingDieselPreviousDay",
        available: "$todayAvailableDiesel",
        delivery: "$todayDieselDelivery",
        revenue: "$todayDieselRevenue",
      };

  // ---------------------------------
  // 3️⃣ AGGREGATION LOGIC
  // ---------------------------------

  // CASE 1: WEEK OR MONTH → return daily data
  if (time === "this-week" || time === "this-month") {
    const dailyStats = await InventoryModel.aggregate([
      { $match: matchStage },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          load: fieldMap.load,
          remaining: fieldMap.remaining,
          available: fieldMap.available,
          delivery: fieldMap.delivery,
          revenue: fieldMap.revenue,
        },
      },
      { $sort: { date: 1 } }
    ]);

    return {
      time,
      type: fuelType,
      data: dailyStats
    };
  }
  // CASE 2: YEAR → month-wise aggregated totals
  else if (time === "this-year") {
    const yearlyStats = await InventoryModel.aggregate([
      { $match: matchStage },

      // Extract month number + month name + relevant fields
      {
        $project: {
          monthNumber: { $month: "$createdAt" },
          monthName: { $dateToString: { format: "%B", date: "$createdAt" } },
          load: fieldMap.load,
          remaining: fieldMap.remaining,
          available: fieldMap.available,
          delivery: fieldMap.delivery,
          revenue: fieldMap.revenue,
        },
      },

      // Group month-wise totals
      {
        $group: {
          _id: "$monthNumber",
          monthName: { $first: "$monthName" }, // Keep the month text
          totalLoad: { $sum: "$load" },
          totalRemaining: { $sum: "$remaining" },
          totalAvailable: { $sum: "$available" },
          totalDelivery: { $sum: "$delivery" },
          totalRevenue: { $sum: "$revenue" },
        },
      },

      // Sort by actual month number
      { $sort: { _id: 1 } },
    ]);

    return {
      time,
      type: fuelType,
      data: yearlyStats,
    };
  }


  // return null;
};



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
    filterInventoryService
    // generateDailyInventoryService
 };
export default InventoryServices;