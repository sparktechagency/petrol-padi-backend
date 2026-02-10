import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import OrderValidations from "./Order.validation";
import OrderController from "./Order.controller";


const orderRouter = express.Router();

//customer
orderRouter.post("/create-new-order",
        authorizeUser,
        validateRequest(OrderValidations.createOrderValidation),
        OrderController.createNewOrder
);

orderRouter.get("/customer-all-order",
        authorizeUser,
        validateRequest(OrderValidations.getsupplierOrderValidation),
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

orderRouter.post("/confirm-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.confirmOrder
);

orderRouter.post("/reject-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.rejectOrder
);

//supplier
orderRouter.get("/supplier-all-order",
        authorizeUser,
        validateRequest(OrderValidations.getsupplierOrderValidation),
        OrderController.supplierAllOrder
);

orderRouter.get("/supplier-single-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.supplierSingleOrder
);

orderRouter.post("/accept-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.acceptOrder
);

orderRouter.post("/complete-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.acceptOrder
);

orderRouter.post("/order-on-the-way/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.orderOnTheWay
);

orderRouter.delete("/delete-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.deleteOrder
);

//dashboard

orderRouter.get("/dashboard-all-order",
        authorizeUser,
        validateRequest(OrderValidations.getDashboardOrderValidation),
        OrderController.dashboardAllOrder
);

orderRouter.get("/dashboard-single-order/:orderId",
        //authorization,
        // validateRequest(OrderValidations.getAllOrderValidation),
        OrderController.dashboardSingleOrder
);


export default orderRouter;