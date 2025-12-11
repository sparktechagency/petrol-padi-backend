import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import CustomerValidations from "./Customer.validation";
import CustomerController from "./Customer.controller";


const customerRouter = express.Router();

//dashboard
customerRouter.get("/dashboard-all-customer",

    CustomerController.dashboardAllCustomer
);

customerRouter.get("/dashboard-single-customer/:customerId",

    CustomerController.dashboardSingleCustomer
);

customerRouter.post("/dashboard-block-user",
    validateRequest(CustomerValidations.blockUserValidation),
    CustomerController.blockUser
);


export default customerRouter;