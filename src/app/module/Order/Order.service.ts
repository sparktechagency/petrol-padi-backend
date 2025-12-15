import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import { IOrder } from "./Order.interface";
import OrderModel from "./Order.model";
import { ENUM_FUEL_TYPE, ENUM_ORDER_STATUS } from "../../../utilities/enum";
import postNotification from "../../../utilities/postNotification";
import SupplierModel from "../Supplier/Supplier.model";

//customer
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
    const order = await OrderModel.findById(orderId)
        .populate({path: "supplier",select:"name"})
        .populate({path: "customer",select:"name"});

    if (!order) {
        throw new ApiError(404, "Order not found to complete order");
    }

    if (!order.supplier || !order.customer) {
        throw new ApiError(400, "Order has invalid supplier or customer");
    }

    const supplier = await SupplierModel.findById(order.supplier);

    if(order.fuelType === ENUM_FUEL_TYPE.FUEL){
        //adjust reserve fuel
        supplier.todayReservedFuelForDelivery -= order.quantity;
    
    }

    else if( order.fuelType === ENUM_FUEL_TYPE.DIESEL){
        //adjust reserve fuel
        supplier.todayReservedDieselForDelivery -= order.quantity;
    }

    //update order status
    order.status = ENUM_ORDER_STATUS.COMPLETED;

    await Promise.all([ order.save(), supplier.save() ]);

    if(order.status !== ENUM_ORDER_STATUS.COMPLETED){
        throw new ApiError(500,"Failed to Confirm order");
    }else {

        await Promise.all([
            //admin will receive a notification
            postNotification({title: `${order?.supplier?.name}  completed ${order?.quantity}L ${order?.fuelType} delivery request to Mr. ${order?.customer?.name}, address: ${order?.location}.`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `Your ${order?.quantity}L ${order?.fuelType} request is completed by ${order?.supplier?.name}. Give a feedback, rating to him.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `You successfully completed ${order?.quantity}L ${order?.fuelType} delivery request to Mr. ${order?.customer?.name}, address: ${order?.location}.`})
        ]);
    }

    return {status: order.status, quantity: order.quentity, fuelType: order.fuelType};


    //payment will be added to supplier account.
    // as the order is completed
    //here mongoose session have to use

    

}

const rejectOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findById(orderId)
        .populate({path: "supplier",select:"name"})
        .populate({path: "customer",select:"name"});

    if (!order) {
        throw new ApiError(404, "Order not found to reject request");
    }

    if (!order.supplier || !order.customer) {
        throw new ApiError(400, "Order has invalid supplier or customer");
    }

    const supplier = await SupplierModel.findById(order.supplier);

    if(order.fuelType === ENUM_FUEL_TYPE.FUEL){
        //adjust reserve fuel
        supplier.todayReservedFuelForDelivery -= order.quantity;
    
        //adjust fuel stock
        supplier.todayFuelStock += order.quantity; 
    }

    else if( order.fuelType === ENUM_FUEL_TYPE.DIESEL){
        //adjust reserve fuel
        supplier.todayReservedDieselForDelivery -= order.quantity;
    
        //adjust fuel stock
        supplier.todayDieselStock += order.quantity; 

    }

    //update order status
    order.status = ENUM_ORDER_STATUS.REJECTED;

    await Promise.all([ order.save(), supplier.save() ]);

    if(order.status !== ENUM_ORDER_STATUS.REJECTED){
        throw new ApiError(500,"Failed to reject order");
    }else {

        await Promise.all([
            //admin will receive a notification
            postNotification({title: `${order?.customer?.name}  rejected ${order?.quantity}L ${order?.fuelType} order request from Mr. ${order?.supplier?.name}, address: ${order?.location}.`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `You rejected ${order?.quantity}L ${order?.fuelType} delivery request, supplier: ${order?.supplier?.name}. your payment will be refunded.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `Your pending  ${order?.quantity}L ${order?.fuelType} delivery request is rejected by  Mr. ${order?.customer?.name}, address: ${order?.location}.`})
        ]);
    }

    return {status: order.status, quantity: order.quentity, fuelType: order.fuelType};


    //not sure what will happen with the payment after rejection
    //need clarification
    

    

}

//supplier

const supplierAllOrderService = async (userDetails: JwtPayload,query: Record<string,unknown>) => {
    const {profileId: supplierId} = userDetails;
    const { orderStatus} = query;

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

    const supplier = await SupplierModel.findById(order.supplier);

    if(order.fuelType === ENUM_FUEL_TYPE.FUEL){
        //check fuel is available
        if(supplier.todayFuelStock < order.quantity){
            throw new ApiError(400,"You don't have enough stock to complete this order.");
        }
        //adjust reserve fuel
        supplier.todayReservedFuelForDelivery += order.quantity;
    
        //adjust fuel stock
        supplier.todayFuelStock -= order.quantity; 
    }

    else if( order.fuelType === ENUM_FUEL_TYPE.DIESEL){
        //check fuel is available
        if(supplier.todayDieselStock < order.quantity){
            throw new ApiError(400,"You don't have enough stock to complete this order.");
        }
        //adjust reserve fuel
        supplier.todayReservedDieselForDelivery += order.quantity;
    
        //adjust fuel stock
        supplier.todayDieselStock -= order.quantity; 

    }

    //update order status
    order.status = ENUM_ORDER_STATUS.ACCEPTED;

    await Promise.all([ order.save(), supplier.save() ]);

    if(order.status !== ENUM_ORDER_STATUS.ACCEPTED){
        throw new ApiError(500,"Failed to accept order");
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

    return {status: order.status, quantity: order.quentity, fuelType: order.fuelType};

}

const orderOnTheWayService = async (orderId: string) => {

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

    // change order status
    order.status = ENUM_ORDER_STATUS.ON_THE_WAY;

    await order.save();

    if(order.status !== ENUM_ORDER_STATUS.ON_THE_WAY){
        throw new ApiError(500,"Failed to change order status to On The Way.");
    }else {

        await Promise.all([
            //admin will receive a notification
            postNotification({title: `${order?.supplier?.name}  changed the status of  ${order?.quantity}L ${order?.fuelType} delivery request to Mr. ${order?.customer?.name}, address: ${order?.location} is on the way`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `Your ${order?.quantity}L ${order?.fuelType} request is on the way. Supplier : ${order?.supplier?.name}. Now wait for delivery.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `Your accepted order ${order?.quantity}L ${order?.fuelType} delivery to Mr. ${order?.customer?.name}, address: ${order?.location} is on the way.`})
        ]);
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