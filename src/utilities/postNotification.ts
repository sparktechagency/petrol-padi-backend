import {NotificationModel,AdminNotificationModel} from "../app/module/Notification/Notification.model";;
import catchAsync from "./catchasync";
import ApiError from "../error/ApiError";
import { INotification, INotificationPayload } from "../app/module/Notification/Notification.interface";


const postNotification = async (data: INotificationPayload) => {

  try {
    // let notification;

    if (data.toId && data.toId.trim() !== "") {
      // Send notification to a user
       await NotificationModel.create(data);
    } else {
      // Send to admin panel
       await AdminNotificationModel.create(data);
    }

    // return notification;

  } catch (error: any) {
    console.error("Notification Error:", error);

    throw new ApiError(
      500,
      error instanceof Error
        ? error.message
        : "Notification creation failed"
    );
  }
};


export default postNotification;