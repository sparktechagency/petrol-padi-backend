import { profile } from "console";
import config from "../../../config";
import ApiError from "../../../error/ApiError";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../../../helper/emailHelper";
import { createToken } from "../../../helper/jwtHelper";
import generateVerifyCode from "../../../utilities/codeGenerator";
import { IUser } from "../User/User.interface";
import UserModel from "../User/User.model";
import { JwtPayload, Secret,SignOptions } from "jsonwebtoken";
import { TLoginUser } from "./auth.interface";
import { comparePassword } from "../../../helper/bcryptHelper";
import CustomerModel from "../Customer/Customer.model";
import { ICustomer } from "../Customer/Customer.interface";
import SupplierModel from "../Supplier/Supplier.model";
import { ISupplier } from "../Supplier/Supplier.interface";
import { send } from "process";


const registerUserService = async (payload: IUser) => {
    // Service logic goes here
    const {name,email,phone,password,role} = payload;

    const emailExist = await UserModel.exists({ email: email });

    if (emailExist) {
        throw new ApiError(400, 'This email already exists');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Generate verification code
        const { code, expiredAt } = generateVerifyCode(10);

        // Prepare user data
        const userDataPayload: Partial<IUser> = {
            name: name,
            email: email,
            phone: phone,
            password,
            role,
            verificationCode: code,
            // 5 minutes expiry
            // codeExpireIn: new Date(Date.now() + 5 * 60000), 
        };

        // Create user
        const [user] = await UserModel.create([userDataPayload], { session });

        // Create profile (customer or provider)
        let profile;

        if (role === 'Customer') {

            const customerPayload = {
                user: user._id,name,email,phone
            };

            [profile] = await CustomerModel.create([customerPayload], { session });

        } else if(role === 'Supplier'){
            const providerPayload = {
                user: user._id,name,email,phone
            };
            [profile] = await SupplierModel.create([providerPayload], { session });
        }

        // Link profile to user
        // await UserModel.findByIdAndUpdate(
        //     user._id,
        //     { profileId: profile._id },
        //     { session }
        // );
        user.profile = profile._id;
        await user.save({ session });

        //send email with verification code
        await sendVerificationEmail(email,{
            name: name,
            code: code
        });

        //generate token
        // const tokenPayload = {
        //     userId: user?._id as string,
        //     profileId: profile?._id as string,
        //     role: user?.role,
        //     email: user?.email
        // };

        // const accessToken: string =  createToken(
        //     tokenPayload,
        //     config.jwt.secret as Secret,
        //     config.jwt.expires_in as SignOptions["expiresIn"]
        // );

        const newUser : object = {
            name: name,
            email: email,
            phone: phone,
            role: role,
            
        }

        // If SMS sent successfully, commit transaction
        await session.commitTransaction();
        session.endSession();
        
        return {newUser};
        // return profile;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

}

const loginUserService = async (payload: TLoginUser) => {

    const {email,password} = payload;

    // Service logic goes here
    const user = await UserModel.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, 'This user does not exist');
    }
    
    if (user.isBlocked) {
        throw new ApiError(403, 'This user is blocked');
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

    if(password !== user.password){
        throw new ApiError(403,'Password do not match');
    }


    //generate token
    const tokenPayload = {
        userId: user?._id as string,
        profileId: user?.profile as string,
        role: user?.role,
        email: user?.email
    };

    const accessToken: string =  createToken(
        tokenPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as SignOptions["expiresIn"]
    );


    const newUser : object = {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        role: user.role,
        
    }

    return {user: newUser,accessToken};
}

const verifyCode = async (payload:{email: string, verifyCode: string}) => {
    const { email, verifyCode } = payload;

    const user = await UserModel.findOne({ email: email }).select("profile email role verificationCode isEmailVerified");

    if (!user) {
        throw new ApiError(404, 'User not found to verify otp');
    }

    // if (user.codeExpireIn < new Date(Date.now())) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'Verify code is expired');
    // }

    if (verifyCode !== user.verificationCode) {
        throw new ApiError(400, "Code doesn't match");
    }

    // const result = await UserModel.findOneAndUpdate(
    //     { email: email },
    //     { isVerified: true },
    //     { new: true, runValidators: true }
    // );

    user.verificationCode = '';
    user.isEmailVerified = true;
    await user.save();

    

    // if (!result) {
    //     throw new AppError(
    //         httpStatus.SERVICE_UNAVAILABLE,
    //         'Server temporary unable please try again letter'
    //     );
    // }

    // Create JWT tokens
    const tokenPayload = {
        userId: user?._id,
        profileId: user?.profile,
        email: user?.email,
        role: user?.role,
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

    return  accessToken;
};

const sendVerifyCodeService = async (payload:{email: string}) => {
    const { email } = payload;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, 'User not found to send otp');
    }

    const {code, expiredAt} = generateVerifyCode(10);

    
    user.verificationCode = code;

    await user.save();

    await sendVerificationEmail(email,{
        name: user.name,
        code: code
    });

    return null;
}

// reset password
const resetPasswordService = async (payload: {
    email: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    const { email, newPassword } = payload;

    const user = await UserModel.findOne({ email: payload.email });

    if (!user) {
        throw new ApiError(404, 'This user does not exist to reset password');
    }

    if (user.isBlocked) {
        throw new ApiError(403, 'This user is blocked. Cannot reset password');
    }

    //hash new password
    // const newHashedPassword = await bcrypt.hash(
    //     payload.password,
    //     Number(config.bcrypt_salt_rounds)
    // );

    user.password = newPassword;
    await user.save();

    //generate new token after password reset
    const tokenPayload = {
        userId: user?._id as string,
        profileId: user?.profile as string,
        role: user?.role,
        email: user?.email
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

    return {user:{name:user.name,email:user.email,role:user.role}, accessToken };
};



const AuthServices = { 
    registerUserService,
    loginUserService,
    verifyCode,
    sendVerifyCodeService,
    resetPasswordService
};
export default AuthServices;