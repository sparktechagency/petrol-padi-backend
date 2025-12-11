import { all } from "axios";
import ApiError from "../../../error/ApiError";
import { ICustomer } from "./Customer.interface";
import CustomerModel from "./Customer.model";
import { ENUM_USER_ROLE } from "../../../utilities/enum";
import UserModel from "../User/User.model";
import AdminModel from "../Dashboard/Admin.model";


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
    getAllCustomerService,
    getSingleCustomerService,
    blockUserService
 };
export default CustomerServices;