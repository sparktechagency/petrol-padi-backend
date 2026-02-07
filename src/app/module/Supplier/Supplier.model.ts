import { model, models, Schema } from "mongoose";
import { ISupplier } from "./Supplier.interface";

const SupplierSchema = new Schema<ISupplier>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    image: { type: String , default: "" },
    // location: { type: String ,  default: "" },
    // latitude: { type: String,  default: "" },
    // longitude: { type: String , default: "" },
     location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            // required: true
            default: [0, 0]
        }
        
    },
    address: {
        type: String,
        // required: true
        default: ""
    },
    document: { type: String , default: "" },

    todayFuelRate: { type: Number, default: 0 },
    todayDieselRate: { type: Number, default: 0 },

    todayFuelLoad: { type: Number, default: 0 },
    previousDayFuelLoadRemain: { type: Number, default: 0 },
    todayCompletedFuelDelivery: { type: Number, default: 0 },
    todayReservedFuelForDelivery: { type: Number, default: 0 },
    todayFuelStock: { type: Number, default: 0 },

    todayDieselLoad: { type: Number, default: 0 },
    previousDayDieselLoadRemain: { type: Number, default: 0 },
    todayCompletedDieselDelivery: { type: Number, default: 0 },
    todayReservedDieselForDelivery: { type: Number, default: 0 },
    todayDieselStock: { type: Number, default: 0 },

    bankName: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    bankCode: { type: String, default: "" },
    bankVerificationStatus: { type: Boolean, default: false },

    totalRating: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },

    isApproved: {type: Boolean, default: false}
}, { timestamps: true });


SupplierSchema.index({ location: "2dsphere" });
SupplierSchema.index({ isApproved: 1 });
SupplierSchema.index({ todayFuelRate: 1 });
SupplierSchema.index({ todayDieselRate: 1 });


const SupplierModel = models.Supplier || model<ISupplier>("Supplier", SupplierSchema);

export default SupplierModel;