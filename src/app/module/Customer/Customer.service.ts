import httpStatus from "http-status";
import AppError from "../../error/appError";
import { ICustomer } from "./Customer.interface";
import CustomerModel from "./Customer.model";

const updateUserProfile = async (id: string, payload: Partial<ICustomer>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await CustomerModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await CustomerModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const CustomerServices = { updateUserProfile };
export default CustomerServices;