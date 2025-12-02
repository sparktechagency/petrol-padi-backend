import ApiError from "../../../error/ApiError";
import { ENUM_FUEL_TYPE } from "../../../utilities/enum";
import { addFuelRate, ISupplier } from "./Supplier.interface";
import SupplierModel from "./Supplier.model";

const findLowestHighestFuelRateService = async (locationQuery: Record<string,unknown>) => {

    //if filter is needed by location then have to add filter by location

    //highest and lowest rate fuel
    const result = await SupplierModel.aggregate([
        {
            $match: {
                location: { $regex: locationQuery, $options: "i" } // case-insensitive match
            }
        },
        {
            $facet: {
                lowestFuelRate: [
                    { $sort: { todayFuelRate: 1 } },
                    { $limit: 1 },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            todayFuelRate: 1
                        }
                    }
                ],
                highestFuelRate: [
                    { $sort: { todayFuelRate: -1 } },
                    { $limit: 1 },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            todayFuelRate: 1
                        }
                    }
                ],
                lowestDieselRate: [
                    { $sort: { todayDieselRate: 1 } },
                    { $limit: 1 },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            todayDieselRate: 1
                        }
                    }
                ],
                highestDieselRate: [
                    { $sort: { todayDieselRate: -1 } },
                    { $limit: 1 },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            todayDieselRate: 1
                        }
                    }
                ],
            }
        }
    ]);

    //all supplier around customer filtered by city
    const suppliers = await SupplierModel.aggregate([
        {
            $match: {
                location: { $regex: locationQuery, $options: "i" } // case-insensitive match
            }
        },
        {
            $sort:{ todayFuelRate: 1 }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                // email: 1,
                // phone: 1,
                // image: 1,
                location: 1,
                // latitude: 1,
                // longitude: 1,
                todayFuelRate: 1,
                todayDieselRate: 1
            }
        }
    ]);

    return {result,suppliers}
    
};

const supplierDetailService = async (supplierId: string) => {

    if(!supplierId){
        throw new ApiError(400,"Supplier is is required to get supplier details");
    }

    const supplier = await SupplierModel.findById(supplierId).select("name email phone location todayFuelRate todayDieselRate todayFuelStock todayDieselStock").lean();

    let result = {};

    // if(fuelType === ENUM_FUEL_TYPE.FUEL){

    // }

    // else if(fuelType === ENUM_FUEL_TYPE.DIESEL){

    // }

    //get supplier rating
    //get all review from review collection and then calculate avg and total rating
    //or everytime new rating is added determine avg and total and keep it with supplier


}

const addFuelRateService = async (payload: addFuelRate) => {
    const {todayFuelRate, todayDieselRate, fuelType, profileId} = payload;

    let supplier;

    if(fuelType === ENUM_FUEL_TYPE.FUEL){
        supplier = await SupplierModel.findByIdAndUpdate(profileId,{
            todayFuelRate: todayFuelRate
        },{new: true});
    }
    else if(fuelType === ENUM_FUEL_TYPE.DIESEL){
        supplier = await SupplierModel.findByIdAndUpdate(profileId,{
            todayDieselRate: todayDieselRate
        },{new: true});
    }

    if(!supplier){
        throw new ApiError(500,"Failed to add fuel rate");
    }

    return null;
    
}

const getFuelRateService = async (query: Record<string,unknown>) => {
    const {profileId} = query;

    const supplier = await SupplierModel.findById(profileId).select("name email todayFuelRate todayDieselRate");

    return supplier;

}

const SupplierServices = { 
    findLowestHighestFuelRateService,
    supplierDetailService,
    addFuelRateService,
    getFuelRateService
 };
export default SupplierServices;