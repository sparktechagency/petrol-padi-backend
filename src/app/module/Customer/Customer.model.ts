import { model, Schema } from "mongoose";
import { ICustomer } from "./Customer.interface";

const CustomerSchema = new Schema<ICustomer>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    
}, { timestamps: true });

const CustomerModel = model<ICustomer>("Customer", CustomerSchema);

export default CustomerModel;