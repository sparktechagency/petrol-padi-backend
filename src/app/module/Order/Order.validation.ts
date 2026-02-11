import { includes, z } from "zod";
import { ENUM_ORDER_STATUS } from "../../../utilities/enum";

// const createOrderValidation = z.object({
//     body: z.object({
//         // customer: z.string().min(1,"Customer id is required"),
//         supplier: z.string().min(1,"Supplier id is required"),
//         // fuelType: z.string().min(1,"Fueltype is required"),
//         // fuelPriceRate: z.number().positive().min(1,"Minimum 1 NGN  is required"),
//         // fuelQuantity: z.number().positive().min(1,"Minimum 1 litre fuel is required"),
//         // dieselPriceRate: z.number().positive().min(1,"Minimum 1 NGN  is required"),
//         // dieselQuantity: z.number().positive().min(1,"Minimum 1 litre fuel is required"),
//         // fuelPrice: z.number().positive().min(1,"Minimum 1 NGN  is required."),
//         // dieselPrice: z.number().positive().min(1,"Minimum 1 NGN  is required."),
//         totalPrice: z.number().positive().min(1,"Minimum 1 NGN  is required."),
//         location: z.string().min(1,"location is required"),
//         latitude: z.string().min(1,"latitude is required"),
//         longitude: z.string().min(1,"longitude is required"),
        
//     })
// });

export const createOrderValidation = z.object({
  body: z
    .object({
      supplier: z.string().min(1, "Supplier id is required"),

      // Fuel fields
      fuelPriceRate: z.number().min(0, "Fuel price rate must be 0 or more"),
      fuelQuantity: z.number().min(0, "Fuel quantity must be 0 or more"),
      fuelPrice: z.number().min(0, "Fuel price must be 0 or more"),

      // Diesel fields
      dieselPriceRate: z.number().min(0, "Diesel price rate must be 0 or more"),
      dieselQuantity: z.number().min(0, "Diesel quantity must be 0 or more"),
      dieselPrice: z.number().min(0, "Diesel price must be 0 or more"),

      totalPrice: z.number().positive("Minimum 1 NGN is required"),

      location: z.string().min(1, "Location is required"),
      latitude: z.string().min(1, "Latitude is required"),
      longitude: z.string().min(1, "Longitude is required"),
    })
    .superRefine((data, ctx) => {
      // 🚨 If both quantities are 0 → throw error
      if (data.fuelQuantity === 0 && data.dieselQuantity === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one of Fuel or Diesel quantity must be greater than 0",
          path: ["fuelQuantity"], // You can attach to any field
        });
      }
    }),
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
        orderStatus: z.enum(Object.values(ENUM_ORDER_STATUS))
        //     .refine((val) => val.includes(Object.values(ENUM_ORDER_STATUS)), {
        //     message: "Fuel type must be either 'fuel' or 'diesel'"
        // }),
        
    })
});

const getDashboardOrderValidation = z.object({
  query: z.object({
    orderStatus: z
      .enum(Object.values(ENUM_ORDER_STATUS) as [string, ...string[]])
      .optional(),
  }),
});



const OrderValidations = { 
    createOrderValidation,
    getAllOrderValidation ,
    getsupplierOrderValidation,
    getDashboardOrderValidation
};
export default OrderValidations;