import { model, models, Schema } from "mongoose";
import { ICustomer } from "./Customer.interface";

const CustomerSchema = new Schema<ICustomer>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    image: { type: String, default: "" },
    // location: { type: String, default: "" },
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
        },
        address: {
            type: String,
            // required: true
            default: ""
        }
    },
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
    bankName: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
}, { timestamps: true });

const CustomerModel = models.Customer || model<ICustomer>("Customer", CustomerSchema);

export default CustomerModel;