import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import SupplierValidations from "./Supplier.validation";
import SupplierController from "./Supplier.controller";
import { uploadDocument } from "../../../helper/multerUpload";
import { validate } from "node-cron";


const supplierRouter = express.Router();


supplierRouter.get("/find-nearest-supplier",
  // validateRequest(SupplierValidations.latLngQuerySchema),
  SupplierController.findLowestHighestFuelRate  
);

supplierRouter.get("/search-supplier-by-name",
  SupplierController.searchSupplierByName  
);

supplierRouter.get("/supplier-details",
  authorizeUser,
  SupplierController.supplierDetails 
);

supplierRouter.post("/add-fuel-rate",
    authorizeUser,
    validateRequest(SupplierValidations.addRateValidation),
  SupplierController.addFuelRate 
);

supplierRouter.get("/get-fuel-rate",
    authorizeUser,
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getFuelRate  
);

supplierRouter.post("/upload-document",
  authorizeUser,
  uploadDocument.single("supplier-file"),
  SupplierController.uploadDocument
);

supplierRouter.get("/get-supplier-revenue",
  authorizeUser,
  SupplierController.supplierRevenue
);

//dashboard

supplierRouter.get("/get-supplier-request",
    authorizeUser,
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getAllSupplierRequest  
);

supplierRouter.get("/get-all-supplier",
    authorizeUser,
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getAllSupplier  
);

supplierRouter.get("/get-supplier-detail/:supplierId",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.getSupplierDetails  
);

supplierRouter.patch("/approve-supplier/:supplierId",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.approveSupplier  
);

supplierRouter.delete("/delete-supplier/:supplierId",
    
    // validateRequest(SupplierValidations.getRateValidation),
  SupplierController.deleteSupplier  
);



export default supplierRouter;