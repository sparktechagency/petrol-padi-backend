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

    profileId : z.string().min(1,"Profile id is required"),
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

const InventoryValidations = { 
    loadFuelValidation,
    getFuelValidation
};
export default InventoryValidations;