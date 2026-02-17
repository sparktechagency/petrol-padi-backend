import ApiError from "../../../error/ApiError";
import { Express } from "express";
import { IAddLocation, IBankDetail, IChangePassword, IUser } from "./User.interface";
import UserModel from "./User.model";
import CustomerModel from "../Customer/Customer.model";
import SupplierModel from "../Supplier/Supplier.model";
import { ENUM_USER_ROLE } from "../../../utilities/enum";
import { ICustomer } from "../Customer/Customer.interface";
import { ISupplier } from "../Supplier/Supplier.interface";
import { JwtPayload } from "jsonwebtoken";
import deleteOldFile from "../../../utilities/deleteFile";
import { resolveBankAccount } from "../../../helper/paystackHelper";




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
  const { name, phone, location, bankName, accountName, accountNumber, bankCode, latitude,longitude } = payload;

  if (name) {
    profile.name = name;
    user.name = name;
  }

  if (phone) {
    profile.phone = phone;
    user.phone = phone;
  }

  //verfify bank details if any of the bank details is provided
  if(bankName || accountName || accountNumber || bankCode){
    if(!bankName || !accountName || !accountNumber || !bankCode){
        throw new ApiError(400,'Please provide complete bank details to update bank information.');
    }
    // const isValidAccount = await resolveBankAccount(accountNumber, bankCode);
    // if(!isValidAccount.data.status){
    //     throw new ApiError(400,'Invalid bank account details. Please provide valid account number and bank code.');
    // }
  }

  if (bankName) profile.bankName = bankName;
  if (accountName) profile.accountName = accountName;
  if (accountNumber) profile.accountNumber = accountNumber;
  if (bankCode) profile.bankCode = bankCode;

  if (location && latitude && longitude) {

      profile.address = location;
      //validate latitude and longitude before updating
      const lat = Number(latitude);
      const lon = Number(longitude);
      if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          throw new ApiError(400, 'Invalid latitude or longitude values.');
      }
      profile.location.coordinates = [lon,lat];
  } 

  // Handle image update
  if (file) {
    if (profile.image) deleteOldFile(profile.image as string);
    profile.image = `uploads/profile-image/${file.filename}`;
  }

  // Save both
  // await Promise.all([profile.save(), user.save()]);
  await profile.save();
  if(name || phone){
    await user.save();
  }

  // Return a unified response
  return {
      name: profile.name,
      email: user.email,
      location: profile.location,
      image: profile.image,
      phone: profile.phone,
      bankName: profile.bankName,
      accountName: profile.accountName,
      accountNumber: profile.accountNumber,
      address: profile.address
  };
};

const getUserProfileService = async (userDetails: JwtPayload) => {
    const {profileId,role} = userDetails;

    let profile;

    switch (role) {

        case ENUM_USER_ROLE.CUSTOMER:
             profile = await CustomerModel.findById(profileId).select("name email phone image location").lean();
            break;

        case ENUM_USER_ROLE.SUPPLIER:
            profile = await SupplierModel.findById(profileId).select("name email phone image location ").lean();
            break;
             
        default:{
            // const _exhaustiveCheck: never = role;
            throw new ApiError(400, "Invalid user role.");
        }

    }

    if(!profile){
        throw new ApiError(404,'Profile not found.');
    }  

    return profile;
}


const addLocationService = async (userDetails: JwtPayload,payload: IAddLocation) => {
    // Service logic goes here
    const {profileId,role} = userDetails;
  //  const {location,latitude,longitude} = payload;
  //  console.log(payload);
    let profile : ICustomer| ISupplier | null = null;

    switch (role) {

        case ENUM_USER_ROLE.CUSTOMER:
             profile = await CustomerModel.findByIdAndUpdate(profileId, {
                location: {
                    type: "Point",
                    coordinates: [Number(payload.longitude), Number(payload.latitude)],
                },
                address: payload.location
                }, {new: true});
            break;

        case ENUM_USER_ROLE.SUPPLIER:
            profile = await SupplierModel.findByIdAndUpdate(profileId, {
                location: {
                    type: "Point",
                    coordinates: [Number(payload.longitude), Number(payload.latitude)],
                },
                address: payload.location
                }, {new: true});
            break;
             
        default:{
            // const _exhaustiveCheck: never = role;
            throw new ApiError(400, "Invalid user role.");
        }

    }

    if(!profile){
        throw new ApiError(500,'Failed to add location in the profile.');
    }  

    return { name:profile.name,email:profile.email, location: profile.location };
}


const addBankDetailService = async (userDetails: JwtPayload,payload: IBankDetail) => {
    // Service logic goes here
    const {profileId,role} = userDetails;
  // console.log(payload);

    let profile: any;

    //check bank account is valid or not
    // const isValidAccount = await resolveBankAccount(payload.accountNumber, payload.bankCode);
    // if(!isValidAccount.data.status){
    //     throw new ApiError(400,'Invalid bank account details.Please provide valid account number and bank code.');
    // }

    switch (role) {
        case ENUM_USER_ROLE.CUSTOMER:
             profile = await CustomerModel.findByIdAndUpdate(profileId,{
              $set: {...payload, bankVerificationStatus: true}
             } , {new: true});
            break;

        case ENUM_USER_ROLE.SUPPLIER:
            profile = await SupplierModel.findByIdAndUpdate(profileId, {
              $set: { ...payload, bankVerificationStatus: true}
            }, {new: true});
            break;
             
        default:{
            // const _exhaustiveCheck: never = role;
            throw new ApiError(400, "Invalid user role");
        }

    }
    // console.log(profile);
    if(!profile){
        throw new ApiError(500,'Failed to add location in the profile');
    }  

    return { 
        name:profile.name,
        email:profile.email, 
        bankName:profile.bankName, 
        accountName:profile.accountName,
        accountNumber:profile.accountNumber, 
        bankCode: profile.bankCode
     };
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
    getUserProfileService,
    addLocationService,
    addBankDetailService,
    changePasswordService 
};
export default UserServices;