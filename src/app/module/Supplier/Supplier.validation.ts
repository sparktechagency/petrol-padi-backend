import { z } from "zod";

const addRateValidation = z.object({
  body: z.object({
    todayFuelRate: z.number().positive().optional(),
    todayDieselRate: z.number().positive().optional(),

    fuelType: z.string()
      .min(1, "Fuel type is required")
      .refine((val) => val === "Fuel" || val === "Diesel", {
        message: "Fuel type must be either 'Fuel' or 'Diesel'"
      }),

    profileId : z.string().min(1,"Profile id is required"),
  }).refine(
    (data) => data.todayFuelRate !== undefined || data.todayDieselRate !== undefined,
    { message: "At least one of todayFuelRate or todayDieselRate is required" }
  )
});

const getRateValidation = z.object({
  query: z.object({
    // fuelType: z.string()
    //   .min(1, "Fuel type is required")
    //   .refine((val) => val === "Fuel" || val === "Diesel", {
    //     message: "Fuel type must be either 'fuel' or 'diesel'"
    //   }),

    profileId: z.string().min(1, "Profile id is required"),
  })
});




const SupplierValidations = { 
    addRateValidation,
    getRateValidation
 };

export default SupplierValidations;