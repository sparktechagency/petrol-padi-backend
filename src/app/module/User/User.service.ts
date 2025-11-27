import ApiError from "../../../error/ApiError";
import { Express } from "express";
import { IAddLocation, IChangePassword, IUser } from "./User.interface";
import UserModel from "./User.model";
import CustomerModel from "../Customer/Customer.model";
import SupplierModel from "../Supplier/Supplier.model";
import { ENUM_USER_ROLE } from "../../../utilities/enum";
import { ICustomer } from "../Customer/Customer.interface";
import { ISupplier } from "../Supplier/Supplier.interface";
import { JwtPayload } from "jsonwebtoken";
import deleteOldFile from "../../../utilities/deleteFile";



const updateUserProfile = async (
  userDetails: JwtPayload,
  file: Express.Multer.File | undefined,
  payload: Partial<ICustomer & ISupplier>
) => {
  const { userId, profileId, role } = userDetails;

  // Pick model based on user role
  const ProfileModel =
    role === ENUM_USER_ROLE.CUSTOMER
      ? CustomerModel
      : role === ENUM_USER_ROLE.SUPPLIER
      ? SupplierModel
      : null;

  if (!ProfileModel) {
    throw new ApiError(400, "Invalid user role");
  }

  // Fetch user and profile in parallel
  const [user, profile] = await Promise.all([
    UserModel.findById(userId),
    ProfileModel.findById(profileId),
  ]);

  if (!user || !profile) {
    throw new ApiError(404, "Profile not found to update");
  }

  // Update fields
  const { name, phone, location, bankName, accountName, accountNumber } = payload;

  if (name) {
    profile.name = name;
    user.name = name;
  }

  if (phone) {
    profile.phone = phone;
    user.phone = phone;
  }

  if (bankName) profile.bankName = bankName;
  if (accountName) profile.accountName = accountName;
  if (accountNumber) profile.accountNumber = accountNumber;
  if (location) profile.location = location;

  // Handle image update
  if (file) {
    if (profile.image) deleteOldFile(profile.image as string);
    profile.image = `uploads/profile-image/${file.filename}`;
  }

  // Save both
  await Promise.all([profile.save(), user.save()]);

  // Return a unified response
  return {
    profile: {
      name: profile.name,
      email: user.email,
      location: profile.location,
    },
  };
};


const addLocationService = async (payload: IAddLocation) => {
    // Service logic goes here
   const {location,role, userId} = payload;

    let profile : ICustomer| ISupplier | null = null;

    switch (role) {

        case ENUM_USER_ROLE.CUSTOMER:
             profile = await CustomerModel.findByIdAndUpdate(userId, {location: location}, {new: true});
            break;

        case ENUM_USER_ROLE.SUPPLIER:
            profile = await SupplierModel.findByIdAndUpdate(userId, {location: location}, {new: true});
            break;
             
        default:{
            // const _exhaustiveCheck: never = role;
            throw new ApiError(400, "Invalid user role");
        }

    }

    if(!profile){
        throw new ApiError(500,'Failed to add location in the profile');
    }  

    return {profile:{ name:profile.name,email:profile.email, location: profile.location }};
}

const changePasswordService = async (userDetails: JwtPayload, payload: IChangePassword) => {
    // Service logic goes here
    const { userId } = userDetails;
    const { oldPassword, newPassword } = payload;

    const user =  await UserModel.findById(userId).select('+password');
    if(!user){
        throw new ApiError(404,'User not found');
    }

    // const isPasswordMatched = await user.isPasswordMatched(oldPassword);
    // if(!isPasswordMatched){
    //     throw new ApiError(400,'Old password is incorrect');
    // }
    if(user.password !== oldPassword){
        throw new ApiError(400,'Old password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return null;
}

const UserServices = {
    updateUserProfile, 
    addLocationService,
    changePasswordService 
};
export default UserServices;