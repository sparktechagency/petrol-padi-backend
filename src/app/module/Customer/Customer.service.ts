import { all } from "axios";
import ApiError from "../../../error/ApiError";
import { ICustomer } from "./Customer.interface";
import CustomerModel from "./Customer.model";
import { ENUM_USER_ROLE } from "../../../utilities/enum";
import UserModel from "../User/User.model";
import AdminModel from "../Dashboard/Admin.model";
import { JwtPayload } from "jsonwebtoken";
import SupplierModel from "../Supplier/Supplier.model";


const getProfileDetailService = async (userDetails: JwtPayload) => {

    const {profileId,role} = userDetails;

    let profile;

    if(role === ENUM_USER_ROLE.CUSTOMER){
        profile = await CustomerModel.findById(profileId).select("name email image location").lean();
    }
    else if(role === ENUM_USER_ROLE.SUPPLIER){
        profile = await SupplierModel.findById(profileId).select("name email image location").lean();
    }

    if(!profile){
        throw new ApiError(500,"Failed to get user profile detail.");
    }

    return profile;

}

// dashboard

const getAllCustomerService = async (query: Record<string,unknown>) => {
    let {page, searchText} = query;
    
    if(searchText){
        const searchedCustomer = await CustomerModel.find({
            $or: [
                { name: { $regex: searchText as string, $options: "i" } },
                { email: { $regex: searchText as string, $options: "i" } },
            ],
        }).lean();
        
        return {
            meta:{ page: 1,limit: 10,total: searchedCustomer.length, totalPage: 1 },
            allCustomer: searchedCustomer
        };
    }
    
    //add pagination later  
    page =  Number(page) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;

    const [ allCustomer, totalCustomers ] = await Promise.all([
        CustomerModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        CustomerModel.countDocuments(),
    ]);

    const totalPage = Math.ceil(totalCustomers / limit);
     

    return {
        meta:{ page,limit: 10,total: totalCustomers, totalPage },
        allCustomer
    };
    
};

const getSingleCustomerService = async (id: string) => {
    const customer = await CustomerModel.findById(id).lean();

    return customer;
};

//block / unblock user

const blockUserService = async (query: Record<string,unknown>) => {
    const {userId, userRole} = query;

    let user;
    let msg;

    switch(userRole){
        case ENUM_USER_ROLE.ADMIN :
            user = await AdminModel.findById(userId);
        default:
            user = await UserModel.findById(userId);
    }

    user.isBlocked = !user.isBlockd;
    await user.save();

    if (user.isBlockd) msg = "User blocked successfully.";
    else  msg = "User unblocked successfully.";

    return {user: {name: user.name,email:user.email,isBlocked: user.isBlockd}, msg};

}

const CustomerServices = { 
    getProfileDetailService,
    getAllCustomerService,
    getSingleCustomerService,
    blockUserService
 };
export default CustomerServices;