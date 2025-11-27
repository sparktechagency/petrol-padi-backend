import { z } from "zod";

const helpAndSupportValidation = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().trim().toLowerCase().email("Invalid email address"),
        description: z.string().min(1, "Description is required")
        
    }),
});

const settingsValidationSchema = z.object({
    body: z.object({
        description: z.string().min(1, "Description is required to update")    
    }),
});

const SettingsValidations = { 
    helpAndSupportValidation,
    settingsValidationSchema
};

export default SettingsValidations;