import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import InventoryValidations from "./Inventory.validation";
import InventoryController from "./Inventory.controller";


const inventoryRouter = express.Router();

inventoryRouter.post("/today-load-fuel",
        validateRequest(InventoryValidations.loadFuelValidation),
        InventoryController.todayLoadFuel
);

inventoryRouter.get("/get-loaded-fuel",
        validateRequest(InventoryValidations.getFuelValidation),
        InventoryController.getLoadedFuel
);

export default inventoryRouter;