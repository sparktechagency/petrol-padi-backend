import { Request,Response } from "express";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import SettingsServices from "./Settings.service";

const submitHelpAndSupport = catchAsync(async (req, res) => {

    const result = await SettingsServices.submitHelpAndSupportService(req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Submitted help and support report successfully.",
        data: result,
    });
});

const getHelpAndSupport = catchAsync(async (req, res) => {

    const result = await SettingsServices.getHelpAndSupportService(req.query);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "retrieved all report.",
        data: result,
    });
});

const deleteHelpAndSupport = catchAsync(async (req, res) => {

    const result = await SettingsServices.deleteHelpAndSupportService(req.params.supportId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Deleted a report successfully.",
        data: result,
    });
});

//terms and consition

const getTermsConditions = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.getTermsConditions();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms and Condition retrieved successfully',
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.getPrivacyPolicy();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy Policy retrieved successfully',
    data: result,
  });
});

const editPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {

  const result = await SettingsServices.editPrivacyPolicy(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy policy updated successfully',
    data: result,
  });
});


const editTermsConditions = catchAsync(async (req: Request, res: Response) => {
    
  const result = await SettingsServices.editTermsConditions(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms and Condition updated successfully',
    data: result,
  });
});

const SettingsController = { 
    submitHelpAndSupport,
    getHelpAndSupport,
    deleteHelpAndSupport,
    getTermsConditions,
    getPrivacyPolicy,
    editPrivacyPolicy,
    editTermsConditions
 };
export default SettingsController;