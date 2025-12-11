import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { adminLoginValidation, changeAdminPasswordValidation, createAdminvalidation, editProfilevalidation } from "./Dashboard.validation";
import DashboardController from "./Dashboard.controller";
import AuthValidations from "../auth/auth.validation";



const dashboardRouter = express.Router();

dashboardRouter.post("/create-admin",
    // auth(["Super_Admin"]),
    validateRequest(createAdminvalidation),
    DashboardController.adminRegister
);

dashboardRouter.post("/login-admin",
    // auth(["Super_Admin"]),
    validateRequest(adminLoginValidation),
    DashboardController.adminLogin
);

dashboardRouter.post("/admin-verify-code",
    validateRequest(AuthValidations.verifyCodeValidation)  ,
    DashboardController.adminVerifyCode
);

dashboardRouter.post("/admin-send-verify-code",
    validateRequest(AuthValidations.sendVerifyCodeValidation)  ,
    DashboardController.adminSendVerifyCode
);

dashboardRouter.patch("/admin-reset-password",
    validateRequest(AuthValidations.resetPasswordValidation)  ,
    DashboardController.adminResetPassword
);

dashboardRouter.patch("/edit-admin-profile",
    // auth(["Super_Admin"]),
    validateRequest(editProfilevalidation),
    DashboardController.editAdminProfile
);

dashboardRouter.patch("/change-admin-password",
    // auth(["Super_Admin"]),
    validateRequest(changeAdminPasswordValidation),
    DashboardController.changeAdminPassword
);

dashboardRouter.delete("/delete-admin",
    // auth(["Super_Admin"]),
    // validateRequest(adminLoginValidation),
    DashboardController.deleteAdminAccount
);

dashboardRouter.post("/block-admin",
    // auth(["Super_Admin"]), only super admin can block a admin
    // validateRequest(adminLoginValidation),
    DashboardController.blockAdmin
);

dashboardRouter.get("/dashboard-stat",
    // auth(["Super_Admin"]),
    // validateRequest(adminLoginValidation),
    DashboardController.dashboardStat
);



export default dashboardRouter;