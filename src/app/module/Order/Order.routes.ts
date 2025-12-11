import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import OrderValidations from "./Order.validation";
import OrderController from "./Order.controller";


const orderRouter = express.Router();

orderRouter.post("/create-new-order",
        //authorization,
        validateRequest(OrderValidations.createOrderValidation),
        OrderController.createNewOrder
);

orderRouter.get("/customer-all-order",
        //authorization,
        validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.getAllOrder
);

orderRouter.get("/customer-single-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.getSingleOrder
);

orderRouter.post("/cancel-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.cancelOrder
);

orderRouter.post("/confirm-delivery/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.confirmOrder
);

orderRouter.post("/reject-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.rejectOrder
);

orderRouter.get("/supplier-all-order",
        //authorization,
        validateRequest(OrderValidations.getsupplierOrderValidation),
        OrderController.rejectOrder
);

orderRouter.get("/supplier-single-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.rejectOrder
);

orderRouter.post("/accept-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.confirmOrder
);

orderRouter.post("/order-on-the-way/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.confirmOrder
);

//dashboard

orderRouter.get("/dashboard-all-order",
        //authorization,
        validateRequest(OrderValidations.getDashboardOrderValidation),
        OrderController.dashboardAllOrder
);

orderRouter.get("/dashboard-single-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.dashboardSingleOrder
);


export default orderRouter;