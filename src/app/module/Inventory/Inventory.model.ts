import { model, models, Schema } from "mongoose";
import { IInventory } from "./Inventory.interface";

const InventorySchema = new Schema<IInventory>({
    supplier: { type: Schema.Types.ObjectId, required: true, ref: "Supplier" },

    todayFuelLoad: { type: Number, required: true },
    remainingFuelPreviousDay: { type: Number, required: true },
    todayAvailableFuel: { type: Number, required: true },
    todayFuelDelivery: { type: Number, required: true },
    todayFuelRevenue: { type: Number, required: true },

    todayDieselLoad: { type: Number, required: true },
    remainingDieselPreviousDay: { type: Number, required: true },
    todayAvailableDiesel: { type: Number, required: true },
    todayDieselDelivery: { type: Number, required: true },
    todayDieselRevenue: { type: Number, required: true },
   
}, { timestamps: true });

const InventoryModel = models.Inventory || model<IInventory>("Inventory", InventorySchema);

export default InventoryModel;