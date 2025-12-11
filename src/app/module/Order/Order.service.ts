import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import { IOrder } from "./Order.interface";
import OrderModel from "./Order.model";
import { ENUM_ORDER_STATUS } from "../../../utilities/enum";
import postNotification from "../../../utilities/postNotification";

const createOrderService = async (userDetails: JwtPayload, payload: Partial<IOrder>) => {

    const {profileId} = userDetails;

    const order = await OrderModel.create({customer: profileId,...payload});

    if(!order){
        throw new ApiError(500,"Failed to create new order");
    }

    //admin will receive a notification
    //supplier will receive a notification
    //customer will receive a notification

    return order;
    
};

const getAllOrderService = async (query: Record<string,unknown>) => {

    const { customerId, orderStatus} = query;

    let filterQuery: Object;

    if(orderStatus === "Completed"){
        filterQuery = {customer: customerId, status: {$eq: ENUM_ORDER_STATUS.COMPLETED}}
    }
    else{
        filterQuery = {customer: customerId, status: {$ne: ENUM_ORDER_STATUS.COMPLETED}}
    }

    const allOrder = await OrderModel.find(filterQuery).populate({path: "supplier", select:"name email"}).select("fuelType quantity totalPrice createdAt").lean();

    return allOrder;
}

const singleOrderService = async (orderId: string) => {

    const order = await OrderModel.findById(orderId).populate({path:"supplier", select:"name email phone image location"}).lean();

    //also need supplier avg rating and total rating
    
    return order;

}

const cancelOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findByIdAndUpdate(orderId,{
        status: ENUM_ORDER_STATUS.CANCELED
    },{new: true});

    //adust fuel stock

    //adjust reserve fuel stock

    if(order.status !== ENUM_ORDER_STATUS.CANCELED){
        throw new ApiError(500,"failed to cancel a order");
    }else {

        //admin will receive a notification
        //supplier will receive a notification
    }


    //payment will be refund

    

}

const confirmOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findByIdAndUpdate(orderId,{
        status: ENUM_ORDER_STATUS.COMPLETED
    },{new: true});

    //adjust fuel stock

    //adjust today delivery

    //adjust reserve fuel stock

    if(order.status !== ENUM_ORDER_STATUS.COMPLETED){
        throw new ApiError(500,"failed to confirm a order");
    }else {

        //admin will receive a notification
        //supplier will receive a notification
    }


    //payment will be added to supplier account.
    // as the order is completed
    //here mongoose session have to use

    

}

const rejectOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findByIdAndUpdate(orderId,{
        status: ENUM_ORDER_STATUS.REJECTED
    },{new: true});

    if(order.status !== ENUM_ORDER_STATUS.REJECTED){
        throw new ApiError(500,"failed to reject order");
    }else {

        //admin will receive a notification
        //supplier will receive a notification
    }


    //not sure what will happen with the payment after rejection
    //need clarification
    

    

}

const supplierAllOrderService = async (query: Record<string,unknown>) => {

    const { supplierId, orderStatus} = query;

    const allOrder = await OrderModel.find({supplier: supplierId, status: orderStatus}).populate({path: "customer", select:"name email"}).select("fuelType quantity totalPrice location createdAt").lean();

    return allOrder;
}

const supplierSingleOrderService = async (orderId: string) => {

    const order = await OrderModel.findById(orderId).populate({path:"customer", select:"name email phone image location"}).lean();

    //also need supplier avg rating and total rating
    
    return order;

}

const acceptOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findById(orderId)
        .populate({path: "supplier",select:"name"})
        .populate({path: "customer",select:"name"});

    if (!order) {
        throw new ApiError(404, "Order not found to accept request");
    }

    if (!order.supplier || !order.customer) {
        throw new ApiError(400, "Order has invalid supplier or customer");
    }

    //check fuel is available

    //adjust reserve fuel

    //adjust fuel stock

    //update order status
    order.status = ENUM_ORDER_STATUS.ACCEPTED;
    await order.save();

    if(order.status !== ENUM_ORDER_STATUS.ACCEPTED){
        throw new ApiError(500,"failed to accept order");
    }else {

        await Promise.all([
            //admin will receive a notification
            postNotification({title: `${order?.supplier?.name}  accepted ${order?.quantity}L ${order?.fuelType} request from Mr. ${order?.customer?.name}, address: ${order?.location}.`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `Your ${order?.quantity}L ${order?.fuelType} request is accepted by ${order?.supplier?.name}. Now wait for delivery.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `You accepted ${order?.quantity}L ${order?.fuelType} delivery request from Mr. ${order?.customer?.name}, address: ${order?.location}.`})
        ]);
    }

    return null;

}

const orderOnTheWayService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findByIdAndUpdate(orderId,{
        status: ENUM_ORDER_STATUS.ON_THE_WAY
    },{new: true});

    if(order.status !== ENUM_ORDER_STATUS.ON_THE_WAY){
        throw new ApiError(500,"failed to change order status On The Way");
    }else {

        //admin will receive a notification
        //customer will receive a notification
        //supplier will receive a notification
    }

    return null;

}


const deleteOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findByIdAndDelete(orderId);

    // if(order.status !== ENUM_ORDER_STATUS.ON_THE_WAY){
    //     throw new ApiError(500,"failed to change order status On The Way");
    // }else {

    //     //admin will receive a notification
    //     //customer will receive a notification
    //     //supplier will receive a notification
    // }

    return null;

}

//dashboard

const dashboardAllOrderService = async (query: Record<string,unknown>) => {
    const {orderStatus} = query;

    const orders = await OrderModel.find({orderStatus: orderStatus}).lean();

    return orders;
}

const dashboardSingleOrderService = async (id: string) => {
    // const {orderStatus} = query;

    const order = await OrderModel.findById(id)
                    .populate({path:"customer",select:"name email image phone"})
                        .populate({path:"supplier",select:"name email"})
                            .lean();
    
    if(!order){
        throw new ApiError(404," No order found.");
    }

    return order;
}



const OrderServices = { 
    createOrderService,
    getAllOrderService,
    singleOrderService,
    cancelOrderService,
    confirmOrderService,
    rejectOrderService,
    supplierAllOrderService,
    supplierSingleOrderService,
    acceptOrderService,
    orderOnTheWayService,
    deleteOrderService,
    dashboardAllOrderService,
    dashboardSingleOrderService
 };
export default OrderServices;