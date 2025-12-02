import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import SupplierValidations from "./Supplier.validation";
import SupplierController from "./Supplier.controller";


const supplierRouter = express.Router();


supplierRouter.get("/find-lowest-highest-rate",
  SupplierController.findLowestHighestFuelRate  
);

supplierRouter.get("/supplier-details",
  SupplierController.findLowestHighestFuelRate  
);

supplierRouter.post("/add-fuel-rate",

    validateRequest(SupplierValidations.addRateValidation),
  SupplierController.addFuelRate 
);

supplierRouter.get("/get-fuel-rate",
    
    validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getFuelRate  
);


export default supplierRouter;