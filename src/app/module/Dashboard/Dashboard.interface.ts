
export interface IAdmin {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    verificationCode: string;
    isEmailVerified: boolean;
    isBlocked: boolean;
}