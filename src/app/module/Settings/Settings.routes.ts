import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import SettingsValidations from "./Settings.validation";
import SettingsController from "./Settings.controller";


const settingsRouter = express.Router();

//help and support routes
settingsRouter.post(
    "/submit-help-and-support",
    // auth(),
    validateRequest(SettingsValidations.helpAndSupportValidation),
    SettingsController.submitHelpAndSupport
);


//privacy policy
settingsRouter.get(
    "/get-privacy-policy",
    SettingsController.getPrivacyPolicy
);

settingsRouter.patch(
    "/update-privacy-policy",
    validateRequest(SettingsValidations.settingsValidationSchema),
    SettingsController.editPrivacyPolicy
);

//terms and conditions
settingsRouter.get(
    "/get-terms-and-conditions",
    SettingsController.getTermsConditions
);

settingsRouter.patch(
    "/update-terms-and-conditions",
    validateRequest(SettingsValidations.settingsValidationSchema),
    SettingsController.editTermsConditions
);


export default settingsRouter;