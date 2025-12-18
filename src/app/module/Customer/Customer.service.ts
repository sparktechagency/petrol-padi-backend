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

const getAllCustomerService = async () => {

    const allCustomer = await CustomerModel.find({}).lean();

    return allCustomer;
    
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