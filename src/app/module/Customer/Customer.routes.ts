import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import CustomerValidations from "./Customer.validation";
import CustomerController from "./Customer.controller";


const customerRouter = express.Router();

customerRouter.get("/get-profile-detail",
    authorizeUser,
    CustomerController.getprofileDetail
);

//dashboard
customerRouter.get("/dashboard-all-customer",
    authorizeUser,
    CustomerController.dashboardAllCustomer
);

customerRouter.get("/dashboard-single-customer/:customerId",

    CustomerController.dashboardSingleCustomer
);

customerRouter.post("/dashboard-block-user",
    authorizeUser,
    validateRequest(CustomerValidations.blockUserValidation),
    CustomerController.blockUser
);


export default customerRouter;