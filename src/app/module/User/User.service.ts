import ApiError from "../../../error/ApiError";
import { IUser } from "./User.interface";
import UserModel from "./User.model";

// const updateUserProfile = async (id: string, payload: Partial<IUser>) => {
//     if (payload.email || payload.username) {
//         throw new ApiError(400, "You cannot change the email or username");
//     }
//     const user = await UserModel.findById(id);
//     if (!user) {
//         throw new ApiError(404, "Profile not found");
//     }
//     return await UserModel.findByIdAndUpdate(id, payload, {
//         new: true,
//         runValidators: true,
//     });
// };

// const completeUserService = async (userDetails: JwtPayload,payload: ICustomer | ISupplier) => {
//     // Service logic goes here
//     const {userId,role} = userDetails;

//     let profile;

//     switch (role) {
//         case 'Customer':
//              profile = await CustomerModel.create({...payload,user: userId});
//         case 'Supplier':
//             profile = await SupplierModel.create({...payload,user: userId});
             
//         default:
//             throw new ApiError(400,'Invalid user role');
//     }

//     if(!profile){
//         throw new ApiError(400,'Failed to create profile');
//     }

//     //update user profile field
//     const user = await UserModel.findByIdAndUpdate(
//         userId,
//         { profile: profile._id },
//         { new: true }
//     );

//     if(!user){
//         throw new ApiError(404,'User not found');
//     }       

//     return profile
// }

// const UserServices = { updateUserProfile };
// export default UserServices;