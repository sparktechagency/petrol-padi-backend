import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import InventoryValidations from "./Inventory.validation";
import InventoryController from "./Inventory.controller";


const inventoryRouter = express.Router();

inventoryRouter.post("/today-fuel-loading",
        authorizeUser,
        validateRequest(InventoryValidations.loadFuelValidation),
        InventoryController.todayLoadFuel
);

inventoryRouter.get("/get-inventory-detail",
        authorizeUser,
        // validateRequest(InventoryValidations.getFuelValidation),
        InventoryController.getLoadedFuel
);

inventoryRouter.get("/filter-inventory",
        validateRequest(InventoryValidations.InventoryQueryValidation),
        InventoryController.filterInventory
);

export default inventoryRouter;