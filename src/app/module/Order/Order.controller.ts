import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import OrderServices from "./Order.service";


//customer
const createNewOrder = catchAsync(async (req, res) => {

   const { user } = req as AuthRequest;

    const result = await OrderServices.createOrderService(user,req.body);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "New order created successfully",
        data: result,
    });
});

const getAllOrder = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await OrderServices.getAllOrderService(user,req.query);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a customer's all order successfully",
        data: result,
    });
});

const getSingleOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.singleOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a order details",
        data: result,
    });
});

const cancelOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.cancelOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a order details",
        data: result,
    });
});

const confirmOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.confirmOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order confirmed Successfully",
        data: result,
    });
});

const rejectOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.rejectOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order rejected!!",
        data: result,
    });
});

//dashboard

const supplierAllOrder = catchAsync(async (req, res) => {

     const { user } = req as AuthRequest;

    const result = await OrderServices.supplierAllOrderService(user,req.query);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved supplier's all order successfully",
        data: result,
    });
});

const supplierSingleOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.supplierSingleOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a order details",
        data: result,
    });
});

const acceptOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.acceptOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order accepted!!",
        data: result,
    });
});

const orderOnTheWay= catchAsync(async (req, res) => {

    const result = await OrderServices.orderOnTheWayService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order status On The Way",
        data: result,
    });
});


const deleteOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.deleteOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order deleted successfully.",
        data: result,
    });
});

//dashboard

const dashboardAllOrder = catchAsync(async (req, res) => {

    const result: any = await OrderServices.dashboardAllOrderService(req.query);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Rerrieved all order.",
        meta: result.meta,
        data: result.orders,
    });
});

const dashboardSingleOrder = catchAsync(async (req, res) => {

    const result = await OrderServices.dashboardSingleOrderService(req.params.orderId);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved a order successfully.",
        data: result,
    });
});

const OrderController = { 
    createNewOrder,
    getAllOrder,
    getSingleOrder,
    cancelOrder,
    confirmOrder,
    rejectOrder,
    supplierAllOrder,
    supplierSingleOrder,
    acceptOrder,
    orderOnTheWay,
    deleteOrder,
    dashboardAllOrder,
    dashboardSingleOrder
};
export default OrderController;