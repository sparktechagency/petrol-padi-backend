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

supplierRouter.post("/add-document",
    
    validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getFuelRate  
);

//dashboard

supplierRouter.get("/get-supplier-request",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getAllSupplierRequest  
);

supplierRouter.get("/get-all-supplier",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getAllSupplier  
);

supplierRouter.get("/get-supplier-detail/:supplierId",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getSupplierDetails  
);

supplierRouter.patch("/approve-supplier/:supplierId",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getSupplierDetails  
);

supplierRouter.delete("/delete-supplier/:supplierId",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getSupplierDetails  
);



export default supplierRouter;