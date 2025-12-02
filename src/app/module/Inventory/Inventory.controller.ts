
        import catchAsync from "../../../utilities/catchasync";
        import sendResponse from "../../../utilities/sendResponse";
        import InventoryServices from "./Inventory.service";

        const updateUserProfile = catchAsync(async (req, res) => {
            const { files } = req;
            if (files && typeof files === "object" && "profile_image" in files) {
                req.body.profile_image = files["profile_image"][0].path;
            }
            const result = await InventoryServices.updateUserProfile(
                req.user.profileId,
                req.body
            );
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "Profile updated successfully",
                data: result,
            });
        });

        const InventoryController = { updateUserProfile };
        export default InventoryController;