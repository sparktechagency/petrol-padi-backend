import express from "express";
        import auth from "../../middlewares/auth";
        import validateRequest from "../../middlewares/validateRequest";
        import InventoryValidations from "./Inventory.validation";
        import InventoryController from "./Inventory.controller";
        

        const router = express.Router();

        

        export const InventoryRoutes = router;