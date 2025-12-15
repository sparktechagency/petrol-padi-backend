import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import { ENUM_FUEL_TYPE } from "../../../utilities/enum";
import UserModel from "../User/User.model";
import { addFuelRate, ISupplier } from "./Supplier.interface";
import SupplierModel from "./Supplier.model";
import deleteOldFile from "../../../utilities/deleteFile";

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

const supplierDetailService = async (userDetails: JwtPayload) => {

    const {profileId: supplierId} = userDetails;

    if(!supplierId){
        throw new ApiError(400,"Supplier is is required to get supplier details");
    }

    const supplier = await SupplierModel.findById(supplierId).lean();

    let result = {};

    // if(fuelType === ENUM_FUEL_TYPE.FUEL){

    // }

    // else if(fuelType === ENUM_FUEL_TYPE.DIESEL){

    // }

    //get supplier rating
    //get all review from review collection and then calculate avg and total rating
    //or everytime new rating is added determine avg and total and keep it with supplier

    return supplier;
}

const addFuelRateService = async (userDetails: JwtPayload,payload: addFuelRate) => {
    const {profileId} = userDetails;
    const {todayFuelRate, todayDieselRate, fuelType} = payload;

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

    return {todayFuelRate: supplier.todayFuelRate, todayDieselRate: supplier.todayDieselRate};
    
}

const getFuelRateService = async (userDetails: JwtPayload) => {
    const {profileId} = userDetails;

    const supplier = await SupplierModel.findById(profileId).select("name email todayFuelRate todayDieselRate");

    return supplier;

}

const uploadDocumentService = async (userDetails: JwtPayload, file: Express.Multer.File | undefined) => {
    const {profileId} = userDetails;

    const supplier = await SupplierModel.findById(profileId).select("name email document");

    // Handle image update
  if (file) {
    if (supplier.document) deleteOldFile(supplier.image as string);
    supplier.document = `uploads/supplier-file/${file.filename}`;
  }

  await supplier.save();

  return supplier;

}

//dashboard

const getSupplierRequestService = async () => {

    const allRequest = await SupplierModel.find({isApproved: false}).select("user name email phone image location document createdAt").lean();

    return allRequest;
}

const getAllSupplierService = async () => {

    const allRequest = await SupplierModel.find({isApproved: true}).select("user name email phone image location createdAt").lean();

    return allRequest;
}

const getSupplierDetailsService = async (id: string) => {

    const supplier = await SupplierModel.findById(id).select("name email phone image location bankName accountName accountNumber").lean();

    if(!supplier){
        throw new ApiError(404,"No supplier detail found.");
    }

    return supplier;
}

const approveSupplierService = async (id: string) =>{

    const approvedSupplier = await SupplierModel.findByIdAndUpdate(id,{isApproved: true},{new:true});

    if(!approvedSupplier.isApproved){
        throw new ApiError(500,"Failed to approve this supplier");
    }

    return null;
}

const deleteSupplierService = async (id: string) =>{

    const supplier: any = await SupplierModel.findById(id).lean();

    if(!supplier){
        throw new ApiError(404, "Supplier not found to delete.");
    }

    //delete both supplier and user
    const [deletedUser,deletedSupplier] = await Promise.all([
        UserModel.findByIdAndDelete(supplier?.user),
        SupplierModel.findByIdAndDelete(id)
    ]);

    if(!deletedSupplier || !deletedUser){
        throw new ApiError(500,"Failed to delete supplier.");
    }
}


const SupplierServices = { 
    findLowestHighestFuelRateService,
    supplierDetailService,
    addFuelRateService,
    getFuelRateService,
    uploadDocumentService,
    getAllSupplierService,
    getSupplierRequestService,
    getSupplierDetailsService,
    approveSupplierService,
    deleteSupplierService
 };
export default SupplierServices;