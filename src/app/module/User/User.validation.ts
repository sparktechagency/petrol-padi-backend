import { z } from "zod";

export const updateprofileValidation = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        bankName: z.string().optional(),
        accountName: z.string().optional(),
        accountNumber: z.string().optional(),
    }),
});

export const addLocationValidation = z.object({
    body: z.object({
        role: z.string().min(1, "Role is required"),
        location: z.string().min(1, "Location is required"),
        userId: z.string().min(1, "userId is required"),
        // latitude: z.string().min(1, "Latitude is required"),
        // longitude: z.string().min(1, "Longitude is required"),
    }),
});

const changePasswordValidation = z.object({
    body: z.object({
        oldPassword: z.string().min(4,'Old password must be at least 4 characters'),
        newPassword: z.string().min(4, 'New password must be at least 4 characters'),
        confirmPassword: z.string().min(4, 'Confirm password must be at least 4 characters'),
        
      })
      // validate that password === confirmPassword
      .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
          message: "Password and confirm password must match",
          path: ["confirmPassword"],
        }
      ),
});

const UserValidations = { updateprofileValidation,addLocationValidation,changePasswordValidation };
export default UserValidations;