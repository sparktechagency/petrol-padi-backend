import { z } from "zod";

export const updateSupplierData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const SupplierValidations = { updateSupplierData };
export default SupplierValidations;