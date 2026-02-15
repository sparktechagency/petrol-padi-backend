import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import mongoose from "mongoose";
import { IOrder } from "./Order.interface";
import OrderModel from "./Order.model";
import { ENUM_FUEL_TYPE, ENUM_ORDER_STATUS, ENUM_PAYMENT_STATUS } from "../../../utilities/enum";
import postNotification from "../../../utilities/postNotification";
import SupplierModel from "../Supplier/Supplier.model";
import { refundPayment } from "../../../helper/paystackHelper";
import PaymentModel from "../Payment/Payment.model";
import ReviewModel from "../Review/Review.model";

//customer
const createOrderService = async (userDetails: JwtPayload, payload: Partial<IOrder>) => {

    const {profileId} = userDetails;

    //check supplier has stock or not

    const newOrder = await OrderModel.create({customer: profileId,...payload});

    if(!newOrder){
        throw new ApiError(500,"Failed to create new order.");
    }

    //order will be deleted/canceled
    const order = await OrderModel.findById(newOrder?._id)
        .populate({path: "supplier",select:"name"})
        .populate({path: "customer",select:"name"});

    //admin will receive a notification
    //supplier will receive a notification
    //customer will receive a notification
    await Promise.all([
            //admin will receive a notification
            postNotification({title: `Mr. ${order?.customer?.name}  created a ${order?.quantity}L ${order?.fuelType} delivery order from supplier ${order?.supplier?.name}, address: ${order?.location}.`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `You created a ${order?.quantity}L ${order?.fuelType} delivery order from ${order?.supplier?.name}. Now wait for supplier response.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `You have a new ${order?.quantity}L ${order?.fuelType} delivery request  from Mr. ${order?.customer?.name}, address: ${order?.location}.`})
        ]);

    return order;
    
};

const getAllOrderService = async (userDetails: JwtPayload,query: Record<string,unknown>) => {
    const {profileId} = userDetails;
    const {  orderStatus} = query;
    

    const allOrder = await OrderModel.find({customer: profileId, status: orderStatus}).populate({path: "supplier", select:"name email"}).lean();

    return allOrder;
}

const singleOrderService = async (orderId: string) => {

    const order: IOrder | any = await OrderModel.findById(orderId).populate({path:"supplier", select:" name email phone image  address totalRating averageRating"}).lean();

    //also need supplier avg rating and total rating
    // const supplierIdFromRequest = order?.supplier;

    // const supplierId = new mongoose.Types.ObjectId(order.supplier._id as string);
    

    // const result = await ReviewModel.aggregate([
    //     {
    //         $match: {
    //             supplier: supplierId, // filter for one supplier
    //         },
    //     },
    //     {
    //         $group: {
    //             _id: "$supplier",
    //             totalReviews: { $sum: 1 },
    //             averageRating: { $avg: "$rating" },
    //         },
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             supplierId: "$_id",
    //             totalReviews: 1,
    //             averageRating: {
    //                 $round: ["$averageRating", 1], // optional: round to 1 decimal
    //             },
    //         },
    //     },
    // ]);

    
    return order;

}

const cancelOrderService = async (orderId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Fetch order
    const order = await OrderModel.findById(orderId)
      .populate({ path: "supplier", select: "name" })
        .populate({ path: "customer", select: "name" })
            .session(session);

    if (!order) {
      throw new ApiError(404, "Order not found to cancel request.");
    }

    if (!order.supplier || !order.customer) {
      throw new ApiError(400, "Order has invalid supplier or customer");
    }

    // 2️⃣ Fetch supplier
    const supplier = await SupplierModel.findById(order.supplier).session(session);

    if (!supplier) {
      throw new ApiError(404, "Supplier not found");
    }

    // 3️⃣ Adjust stock
    if (order.fuelType === ENUM_FUEL_TYPE.FUEL) {

      supplier.todayReservedFuelForDelivery -= order.quantity;
      supplier.todayFuelStock += order.quantity;

    } else if (order.fuelType === ENUM_FUEL_TYPE.DIESEL) {

      supplier.todayReservedDieselForDelivery -= order.quantity;
      supplier.todayDieselStock += order.quantity;
    }

    // 4️⃣ Update order state
    order.status = ENUM_ORDER_STATUS.CANCELED;
    order.paymentStatus = "Refund_Pending";

    await Promise.all([
      supplier.save({ session }),
      order.save({ session }),
    ]);

    // 5️⃣ Update payment record (refund pending)
    const payment = await PaymentModel.findOneAndUpdate(
      { reference: order.reference },
      { status: ENUM_PAYMENT_STATUS.REFUND_PENDING },
      { new: true, session }
    );

    if (!payment) {
      throw new ApiError(404, "Payment record not found");
    }

    // 6️⃣ Commit DB transaction
    await session.commitTransaction();
    session.endSession();

    // 7️⃣ Fire notifications (non-blocking)
    Promise.allSettled([
      postNotification({
        title: `${order.customer.name} canceled ${order.quantity}L ${order.fuelType} order from ${order.supplier.name}.`,
      }),
      postNotification({
        toId: order.customer._id,
        title: `Your ${order.quantity}L ${order.fuelType} order has been canceled. Refund is processing.`,
      }),
      postNotification({
        toId: order.supplier._id,
        title: `Order of ${order.quantity}L ${order.fuelType} was canceled by ${order.customer.name}.`,
      }),
    ]);

    // 8️⃣ Call Paystack refund (OUTSIDE transaction)
    const refundResult = await refundPayment(order.reference, order.totalPrice);

    if (!refundResult?.status) {
      // Do NOT rollback DB — webhook or cron will retry
      throw new ApiError(500, "Refund initiation failed.");
    }

    return {
      status: order.status,
      paymentStatus: order.paymentStatus,
      quantity: order.quantity,
      fuelType: order.fuelType,
    };

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const confirmOrderService = async (orderId: string) => {

    //order will be deleted/canceled
    const order = await OrderModel.findById(orderId)
        .populate({path: "supplier",select:"name"})
        .populate({path: "customer",select:"name"});

    if (!order) {
        throw new ApiError(404, "Order not found to confirm order");
    }

    if (!order.supplier || !order.customer) {
        throw new ApiError(400, "Order has invalid supplier or customer");
    }

    // const supplier = await SupplierModel.findById(order.supplier);

    // if(order.fuelType === ENUM_FUEL_TYPE.FUEL){
    //     //adjust reserve fuel
    //     supplier.todayReservedFuelForDelivery -= order.quantity;
    
    // }

    // else if( order.fuelType === ENUM_FUEL_TYPE.DIESEL){
    //     //adjust reserve fuel
    //     supplier.todayReservedDieselForDelivery -= order.quantity;
    // }

    //update order status
    order.status = ENUM_ORDER_STATUS.CONFIRMED;

    await Promise.all([ 
        order.save(), 
        // supplier.save() 
    ]);

    if(order.status !== ENUM_ORDER_STATUS.CONFIRMED){
        throw new ApiError(500,"Failed to Confirm order");
    }else {

        await Promise.all([
            //admin will receive a notification
            postNotification({title: `Mr. ${order?.customer?.name}  confirmed ${order?.quantity}L ${order?.fuelType} delivery order from  ${order?.customer?.name}, address: ${order?.location}.`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `You confirmed ${order?.quantity}L ${order?.fuelType} delivery order from ${order?.supplier?.name}. Give a feedback, rating to him.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `Your ${order?.quantity}L ${order?.fuelType} delivery order is confirmed by Mr. ${order?.customer?.name}, address: ${order?.location}.`})
        ]);
    }

    return {status: order.status, quantity: order.quentity, fuelType: order.fuelType};


    //payment will be added to supplier account.
    // as the order is completed
    //here mongoose session have to use

    

}

const rejectOrderService = async (orderId: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //order will be deleted/canceled
        const order = await OrderModel.findById(orderId)
            .populate({path: "supplier",select:"name"})
                .populate({path: "customer",select:"name"})
                    .session(session);
    
        if (!order) {
            throw new ApiError(404, "Order not found to reject request");
        }
    
        if (!order.supplier || !order.customer) {
            throw new ApiError(400, "Order has invalid supplier or customer");
        }
    
        const supplier = await SupplierModel.findById(order.supplier).session(session);
    
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
        order.paymentStatus = "Refund_pending";

        await Promise.all([ order.save({session}), supplier.save({session}) ]);

        // 5️⃣ Update payment record (refund pending)
        const payment = await PaymentModel.findOneAndUpdate(
            { reference: order.reference },
            { status: ENUM_PAYMENT_STATUS.REFUND_PENDING },
            { new: true, session }
        );

        if (!payment) {
            throw new ApiError(404, "Payment record not found.");
        }

        //commit db transaction
        await session.commitTransaction();
        session.endSession();
    
        if(order.status !== ENUM_ORDER_STATUS.REJECTED){
            throw new ApiError(500,"Failed to reject order.");
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
    
        
        // 8️⃣ Call Paystack refund (OUTSIDE transaction)
        const refundResult = await refundPayment(order.reference, order.totalPrice);

        if (!refundResult?.status) {
            // Do NOT rollback DB — webhook or cron will retry
            throw new ApiError(500, "Refund initiation failed");
        }

        return {
            status: order.status,
            paymentStatus: order.paymentStatus,
            quantity: order.quantity,
            fuelType: order.fuelType,
        };

    } catch (error) {
        
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        throw error;
    }

}

//supplier

const supplierAllOrderService = async (userDetails: JwtPayload,query: Record<string,unknown>) => {
    const {profileId: supplierId} = userDetails;
    const { orderStatus} = query;

    const allOrder = await OrderModel.find({supplier: supplierId, status: orderStatus}).populate({path: "customer", select:"name email"}).lean();

    return allOrder;
}

const supplierSingleOrderService = async (orderId: string) => {

    const order = await OrderModel.findById(orderId).populate({path:"customer", select:"name email phone image address"}).lean();

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
            postNotification({toId: order?.customer?._id, title: `Your ${order?.quantity}L ${order?.fuelType} delivery request is accepted by ${order?.supplier?.name}. Now wait for delivery.`}),
            
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

const completeOrderService = async (orderId: string) => {

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

    // if(order.fuelType === ENUM_FUEL_TYPE.FUEL){
    //     //adjust reserve fuel
    //     supplier.todayReservedFuelForDelivery -= order.quantity;
    
    // }

    // else if( order.fuelType === ENUM_FUEL_TYPE.DIESEL){
    //     //adjust reserve fuel
    //     supplier.todayReservedDieselForDelivery -= order.quantity;
    // }

    //update order status
    order.status = ENUM_ORDER_STATUS.COMPLETED;

    await Promise.all([ order.save(), supplier.save() ]);

    if(order.status !== ENUM_ORDER_STATUS.COMPLETED){
        throw new ApiError(500,"Failed to Complete order.");
    }else {

        await Promise.all([
            //admin will receive a notification
            postNotification({title: `${order?.supplier?.name}  completed ${order?.quantity}L ${order?.fuelType} delivery request to Mr. ${order?.customer?.name}, address: ${order?.location}.`}),
            
            //customer will receive a notification
            postNotification({toId: order?.customer?._id, title: `Your ${order?.quantity}L ${order?.fuelType} request is completed by ${order?.supplier?.name}. Now you confirm the order and Give a feedback, rating to the supplier.`}),
            
            //supplier will receive a notification
            postNotification({toId: order?.supplier?._id, title: `You successfully completed ${order?.quantity}L ${order?.fuelType} delivery request to Mr. ${order?.customer?.name}, address: ${order?.location}. Now wait for client's confirmation. `})
        ]);
    }

    return {status: order.status, quantity: order.quentity, fuelType: order.fuelType};


    //payment will be added to supplier account.
    // as the order is completed
    //here mongoose session have to use

    

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
    let {orderStatus, searchOrderText, page} = query;

    page = parseInt(page as any) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;

    if(searchOrderText){
        const orders = await OrderModel.find({
            status: orderStatus,
            // You can add more fields to search here
            location: { $regex: searchOrderText as string, $options: "i" } ,
        }).lean();

        return {
            meta:{page,limit: 10,total: orders.length, totalPage: 1},
            orders
        };
    }

    const [orders, totalOrders] = await Promise.all([

        OrderModel.find({status: orderStatus})
           .sort({createdAt: -1})
               .skip(skip).limit(limit)
                   .lean(),
    
        OrderModel.countDocuments({status: orderStatus})
    ])

    const totalPage = Math.ceil(totalOrders / limit);

    return {
        meta:{page,limit: 10,total: totalOrders, totalPage},
        orders
    };
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
    completeOrderService,
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