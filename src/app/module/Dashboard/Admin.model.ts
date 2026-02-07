import { model, models, Schema } from "mongoose";
import { IAdmin } from "./Dashboard.interface";



const adminSchema = new Schema<IAdmin>({
    name:{
        type: String,
        required: [true,"Admin name is required."]
    },
    email:{
        type: String,
        required: [true,"Admin email is required."],
        unique: true
    },
    password:{
        type: String,
        required: [true,"Admin password is required."]
    },
    image: {
        type: String,
        default: ''
    },
    phone:{
        type: String,
        default: ''
        // required: [true,"Admin phone number is required."]
    },
    role:{
        type: String,
        default: "Admin"
    },
    verificationCode: {
        type: String,
        default: ''
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});

const AdminModel = models.Admin || model<IAdmin>("Admin", adminSchema);

export default AdminModel;