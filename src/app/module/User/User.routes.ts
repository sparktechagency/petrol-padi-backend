import express from "express";
import auth from "../../middlewares/auth";
// import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./User.validation";
import UserController from "./User.controller";
// import { uploadFile } from "../../helper/fileUploader";

const router = express.Router();



export const UserRoutes = router;