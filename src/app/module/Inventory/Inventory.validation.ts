import { z } from "zod";

const loadFuelValidation = z.object({
  body: z.object({
    todayFuelLoad: z.number().positive().optional(),
    todayDieselLoad: z.number().positive().optional(),

    fuelType: z.string()
      .min(1, "Fuel type is required")
      .refine((val) => val === "Fuel" || val === "Diesel", {
        message: "Fuel type must be either 'Fuel' or 'Diesel'"
      }),

    // profileId : z.string().min(1,"Profile id is required"),
  }).refine(
    (data) => data.todayFuelLoad !== undefined || data.todayDieselLoad !== undefined,
    { message: "At least one of todayFuelRate or todayDieselRate is required" }
  )
});

const getFuelValidation = z.object({
  query: z.object({
    profileId: z.string().min(1, "Profile id is required"),
  })
});


 const InventoryQueryValidation = z.object({
  query: z.object({
    // supplierId: z.string().min(1, "Supplier ID is required"),

    fuelType:  z.string().nonempty("Fuel type is required")
      .refine(val => val === "Fuel" || val === "Diesel", {
        message: "Fuel type must be either 'fuel' or 'diesel'",
      }),

    time:  z.string().nonempty("Time is required")
          .refine(val => ["this-week", "this-month", "this-year"].includes(val), {
            message: "Time must be one of: this-week, this-month, this-year",
          }),
  }),
});


const InventoryValidations = { 
    loadFuelValidation,
    getFuelValidation,
    InventoryQueryValidation
};
export default InventoryValidations;