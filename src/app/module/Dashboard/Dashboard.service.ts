import ApiError from "../../../error/ApiError";
import { TLoginUser } from "../auth/auth.interface";
import AdminModel from "./Admin.model";
import { IAdmin } from "./Dashboard.interface";
import config from "../../../config";
import { JwtPayload,Secret, SignOptions } from "jsonwebtoken";
import { createToken } from "../../../helper/jwtHelper";
import { IChangePassword } from "../User/User.interface";
import CustomerModel from "../Customer/Customer.model";
import SupplierModel from "../Supplier/Supplier.model";
import OrderModel from "../Order/Order.model";
import generateVerifyCode from "../../../utilities/codeGenerator";
import { sendVerificationEmail } from "../../../helper/emailHelper";



const registerAdminService = async (payload: IAdmin) => {
    const {name, email,password,phone} = payload;

    const admin = await AdminModel.create({
        name: name,
        email: email.toLowerCase(),
        password: password,
        phone: phone
    });

    if(!admin){
        throw new ApiError(500,"Failed to create new Admin");
    }

    return {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
    }
}

const loginAdminService = async (payload: TLoginUser) => {

    const {email,password} = payload;

    // Service logic goes here
    const admin = await AdminModel.findOne({ email: email });

    if (!admin) {
        throw new ApiError(404, 'This admin does not exist');
    }
    
    if (admin.isBlocked) {
        throw new ApiError(403, 'This admin is blocked');
    }
    // if (!user.isVerified) {
    //     throw new ApiError(
    //         403,
    //         'You are not verified user . Please verify your email'
    //     );
    // }

    // checking if the password is correct ----
    // if (user.password && !(await UserModel.isPaswordMatched(password, user.password))) {
    //     throw new ApiError(403, 'Password do not match');
    // }

    // if(!comparePassword(password,user.password)){
    //     throw new ApiError(403,'Password do not match');
    // }

    if(password !== admin.password){
        throw new ApiError(403,'Password do not match');
    }


    //generate token
    const tokenPayload = {
        userId: admin?._id as string,
        role: admin?.role,
        email: admin?.email
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );


    const newUser : object = {
        name: admin?.name,
        email: admin?.email,
        phone: admin?.phone,
        role: admin.role,
        
    }

    return {user: newUser,accessToken};
}

const adminVerifyCode = async (payload:{email: string, verifyCode: string}) => {
    const { email, verifyCode } = payload;

    const admin = await AdminModel.findOne({ email: email }).select("profile email role verificationCode isEmailVerified");

    if (!admin) {
        throw new ApiError(404, 'Admin not found to verify otp');
    }

    // if (user.codeExpireIn < new Date(Date.now())) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'Verify code is expired');
    // }

    if (verifyCode !== admin.verificationCode) {
        throw new ApiError(400, "Code doesn't match");
    }

    // const result = await UserModel.findOneAndUpdate(
    //     { email: email },
    //     { isVerified: true },
    //     { new: true, runValidators: true }
    // );

    admin.verificationCode = '';
    admin.isEmailVerified = true;
    await admin.save();

    

    // if (!result) {
    //     throw new AppError(
    //         httpStatus.SERVICE_UNAVAILABLE,
    //         'Server temporary unable please try again letter'
    //     );
    // }

    // Create JWT tokens
    // const tokenPayload = {
    //     userId: user?._id,
    //     profileId: user?.profile,
    //     email: user?.email,
    //     role: user?.role,
    // };

    // const accessToken: string =  createToken(
    //         tokenPayload,
    //         config.jwt.secret as Secret,
    //         config.jwt.expires_in as SignOptions["expiresIn"]
    //     );

    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.jwt_refresh_secret as string,
    //     config.jwt_refresh_expires_in as string
    // );

    return  null;
};

const adminSendVerifyCodeService = async (payload:{email: string}) => {
    const { email } = payload;

    const admin = await AdminModel.findOne({ email: email });

    if (!admin) {
        throw new ApiError(404, 'Admin not found to send otp');
    }

    const {code, expiredAt} = generateVerifyCode(10);

    
    admin.verificationCode = code;

    await admin.save();

    await sendVerificationEmail(email,{
        name: admin.name,
        code: code
    });

    return null;
}

// reset password
const adminResetPasswordService = async (payload: {
    email: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    const { email, newPassword } = payload;

    const admin = await AdminModel.findOne({ email: email });

    if (!admin) {
        throw new ApiError(404, 'This admin does not exist to reset password');
    }

    if (admin.isBlocked) {
        throw new ApiError(403, 'This user is blocked. Cannot reset password');
    }

    //hash new password
    // const newHashedPassword = await bcrypt.hash(
    //     payload.password,
    //     Number(config.bcrypt_salt_rounds)
    // );

    admin.password = newPassword;
    await admin.save();

    //generate new token after password reset
    const tokenPayload = {
        userId: admin?._id as string,
        role: admin?.role,
        email: admin?.email
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );

    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.jwt_refresh_secret as string,
    //     config.jwt_refresh_expires_in as string
    // );

    return {user:{name:admin.name,email:admin.email,role:admin.role}, accessToken };
};

const editProfileService = async (userDetails: JwtPayload, payload: Partial<IAdmin>) => {
    const {userId} = userDetails;

    if(!userId){
        throw new ApiError(400,"Admin id is required to edit admin profile");
    }

    const editedAdmin = await AdminModel.findByIdAndUpdate(userId,{
        ...payload
    },{new: true});

    if(!editedAdmin){
        throw new ApiError(500,"failed to update admin profile.");
    }

    return null;
    
}

const changeAdminPasswordService = async (userDetails: JwtPayload, payload: IChangePassword) => {
    // Service logic goes here
    const { userId } = userDetails;
    const { oldPassword, newPassword } = payload;

    const admin =  await AdminModel.findById(userId).select('+password');
    if(!admin){
        throw new ApiError(404,'Admin not found to change password');
    }

    // const isPasswordMatched = await user.isPasswordMatched(oldPassword);
    // if(!isPasswordMatched){
    //     throw new ApiError(400,'Old password is incorrect');
    // }

    if(admin.password !== oldPassword){
        throw new ApiError(400,'Old password is incorrect');
    }

    admin.password = newPassword;

    await admin.save();

    return null;
}

const deleteAdminService = async (userDetails: JwtPayload) => {
    const {userId} = userDetails;
    if(!userId){
        throw new ApiError(400,"User id is required to delete account");
    }

    const deletedAccount = await AdminModel.findByIdAndDelete(userId);

    if(!deletedAccount){
        throw new ApiError(500,"Failed to delete admin account.");
    }

    return null;
}

const blockAdminService = async (query: Record<string,unknown>) => {
    const {userId} = query;
    
    if(!userId){
        throw new ApiError(400,"Admin id is required to block a admin");
    }

    const admin = await AdminModel.findById(userId);

    //block unblock admin
    admin.isBlockd = !admin.isBlockd;
    await admin.save();

    let msg;
    if(admin.isBlockd) msg = 'Admin is blocked successfully.';
    else msg = 'Admin is unblocked.';

    return {admin:{name: admin.name}, msg };
}

const dashboardStatService = async () => {

    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const pipeline = [
        // {
        //     $match: {
        //     createdAt: { $gte: startOfYear, $lte: endOfYear }
        //     }
        // },
        {
            $group: {
                _id: null,
                
                totalOrders: { $sum: 1 },

                totalCompleted: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
                    }
                },

                totalCanceled: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Canceled"] }, 1, 0]
                    }
                },
                totalDeliveredAmount: {
                    $sum: {
                    $cond: [
                        { $eq: ["$status", "Completed"] },
                        "$totalPrice",
                        0
                    ]
                    }
                }
            }
        },
        {
            $project: {
            _id: 0,
            totalOrders: 1,
            totalCompleted: 1,
            totalCanceled: 1,
            totalDeliveredAmount: 1
            }
        }
    ];

    const [customer,supplier] = await Promise.all([
        CustomerModel.countDocuments(),
        SupplierModel.countDocuments()
    ]);


    const yearlyOrderStats = await OrderModel.aggregate(pipeline);

    return {
        customer,
        supplier,
        yearlyOrderStats
    }

}

const salesActivityService = async (query: Record<string,unknown>) => {
    const {year} = query;

    if(!year){
        throw new ApiError(400,"Year is required to filter sales stat yearly.");
    }

    const result = await OrderModel.aggregate([
    {
        $match: {
        status: "Completed",
        fuelType: { $in: ["Fuel", "Diesel"] },
        createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`)
        }
        }
    },
    {
        $group: {
        _id: {
            month: { $month: "$createdAt" },
            fuelType: "$fuelType"
        },
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalAmount: { $sum: "$totalPrice" }
        }
    },
    {
        $project: {
        _id: 0,
        month: "$_id.month",
        fuelType: "$_id.fuelType",
        totalOrders: 1,
        totalQuantity: 1,
        totalAmount: 1
        }
    },
    { $sort: { month: 1 } }
    ]);

    // ---- SPLIT INTO TWO ARRAYS ----
    const diesel = result.filter(r => r.fuelType === "Diesel");
    const fuel = result.filter(r => r.fuelType === "Fuel");

    return { diesel, fuel };
};


const DashboardService = {
    registerAdminService,
    loginAdminService,
    adminVerifyCode,
    adminSendVerifyCodeService,
    adminResetPasswordService,
    editProfileService,
    changeAdminPasswordService,
    deleteAdminService,
    blockAdminService,
    dashboardStatService,
    salesActivityService
}

export default DashboardService;

