import httpStatus from "http-status";
import AppError from "../../error/appError";
import { ISupplier } from "./Supplier.interface";
import SupplierModel from "./Supplier.model";

const updateUserProfile = async (id: string, payload: Partial<ISupplier>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await SupplierModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await SupplierModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const SupplierServices = { updateUserProfile };
export default SupplierServices;