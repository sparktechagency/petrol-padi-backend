import cron from "node-cron";
import { generateDailyInventoryService,resetSupplierDailyFieldsService } from "../app/module/Inventory/Inventory.service";




const runCronJobEverydatAtNight = () => {
    // Schedule the task
    // “50 23 * * *” means every day at 23:50 (11:50 PM)
    
    cron.schedule("50 23 * * *", async () => {
    
      console.log("Running daily inventory generation…");
    
      await generateDailyInventoryService();
      await resetSupplierDailyFieldsService();
    });

    
}

// {
//     timezone: "Asia/Dhaka"
// }

export default runCronJobEverydatAtNight;