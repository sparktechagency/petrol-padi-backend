import { model, models, Schema } from "mongoose";
import { ISupplier } from "./Supplier.interface";

const SupplierSchema = new Schema<ISupplier>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    image: { type: String , default: "" },
    location: { type: String ,  default: "" },
    latitude: { type: String,  default: "" },
    longitude: { type: String , default: "" },
    todayRate: { type: Number, default: 0 },
    todayFuelLoad: { type: Number, default: 0 },
    previousLoadRemain: { type: Number, default: 0 },
    todayCompletedDelivery: { type: Number, default: 0 },
    todayReservedDelivery: { type: Number, default: 0 },
    fuelStock: { type: Number, default: 0 },
    bankName: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
}, { timestamps: true });

const SupplierModel = models.Supplier || model<ISupplier>("Supplier", SupplierSchema);

export default SupplierModel;