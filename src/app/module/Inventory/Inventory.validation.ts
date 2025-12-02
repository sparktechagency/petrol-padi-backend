import { z } from "zod";

        export const updateInventoryData = z.object({
            body: z.object({
                name: z.string().optional(),
                phone: z.string().optional(),
                address: z.string().optional(),
            }),
        });

        const InventoryValidations = { updateInventoryData };
        export default InventoryValidations;