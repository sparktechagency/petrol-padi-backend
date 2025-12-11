import { z } from "zod";
import { ENUM_USER_ROLE } from "../../../utilities/enum";

const updateCustomerData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const blockUserValidation = z.object({
    query: z.object({
        userId: z.string().min(1,"User id is required to block user."),
        userRole: z.enum(Object.values(ENUM_USER_ROLE) as [string, ...string[]])
      }),
});



const CustomerValidations = { updateCustomerData , blockUserValidation};
export default CustomerValidations;