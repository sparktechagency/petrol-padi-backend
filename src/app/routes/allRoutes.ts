import { Router } from "express";
import authRouter from "../module/auth/auth.routes";
import {paymentRouter} from "../module/Payment/Payment.routes";
import dashboardRouter from "../module/Dashboard/Dashboard.routes";
import userRouter from "../module/User/User.routes";
import supplierRouter from "../module/Supplier/Supplier.routes";
import settingsRouter from "../module/Settings/Settings.routes";
import orderRouter from "../module/Order/Order.routes";
import inventoryRouter from "../module/Inventory/Inventory.routes";
import customerRouter from "../module/Customer/Customer.routes";
import reviewRouter from "../module/Review/Review.routes";
import notificationRouter from "../module/Notification/Notification.routes";

const allRouter = Router();


const moduleRoutes = [
    {
        path: '/auth',
        router: authRouter,
    },
    {
        path: '/paystack',
        router: paymentRouter,
    },
    {
        path: '/dashboard',
        router: dashboardRouter,
    },
    {
        path: '/profile',
        router: userRouter,
    },
    {
        path: '/supplier',
        router: supplierRouter,
    },
    {
        path: '/settings',
        router: settingsRouter,
    },
    {
        path: '/order',
        router: orderRouter,
    },
    {
        path: '/inventory',
        router: inventoryRouter,
    },
    {
        path: '/customer',
        router: customerRouter,
    },
    {
        path: '/review',
        router: reviewRouter,
    },
    {
        path: '/notification',
        router: notificationRouter,
    },
    
];

moduleRoutes.forEach((route) => allRouter.use(route.path, route.router));

export default allRouter;