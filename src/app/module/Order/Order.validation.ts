import { includes, z } from "zod";
import { ENUM_ORDER_STATUS } from "../../../utilities/enum";

const createOrderValidation = z.object({
    body: z.object({
        // customer: z.string().min(1,"Customer id is required"),
        supplier: z.string().min(1,"Supplier id is required"),
        fuelType: z.string().min(1,"Fueltype is required"),
        priceRate: z.number().positive().min(1,"Minimum 1 NGN  is required"),
        quantity: z.number().positive().min(1,"Minimum 1 litre fuel is required"),
        totalPrice: z.number().positive().min(1,"Minimum 1 litre fuel is required"),
        location: z.string().min(1,"location is required"),
        latitude: z.string().min(1,"latitude is required"),
        longitude: z.string().min(1,"longitude is required"),
        
    })
});

const getAllOrderValidation = z.object({
    query: z.object({
        // customer: z.string().min(1,"Customer id is required"),
        customerId: z.string().min(1,"Customer is required"),
        // orderStatus: z.string().min(1,"Customer is required"),  
        
    })
});

const getsupplierOrderValidation = z.object({
    query: z.object({
        // customer: z.string().min(1,"Customer id is required"),
        supplierId: z.string().min(1,"Supplier is required"),
        // orderStatus: z.string().min(1,"Customer is required"), 
        orderStatus: z.enum(Object.values(ENUM_ORDER_STATUS))
        //     .refine((val) => val.includes(Object.values(ENUM_ORDER_STATUS)), {
        //     message: "Fuel type must be either 'fuel' or 'diesel'"
        // }),
        
    })
});

const OrderValidations = { 
    createOrderValidation,
    getAllOrderValidation ,
    getsupplierOrderValidation
};
export default OrderValidations;