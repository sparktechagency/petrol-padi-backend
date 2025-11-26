import { z } from "zod";

export const updateUserData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const UserValidations = { updateUserData };
export default UserValidations;