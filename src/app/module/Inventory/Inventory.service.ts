
        import ApiError from "../../../error/ApiError";
        import { IInventory } from "./Inventory.interface";
        import InventoryModel from "./Inventory.model";

        const updateUserProfile = async (id: string, payload: Partial<IInventory>) => {
            if (payload.email || payload.username) {
                throw new ApiError(400, "You cannot change the email or username");
            }
            const user = await InventoryModel.findById(id);
            if (!user) {
                throw new ApiError(404, "Profile not found");
            }
            return await InventoryModel.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true,
            });
        };

        const InventoryServices = { updateUserProfile };
        export default InventoryServices;