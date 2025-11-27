/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

 //upload profile image
 const profileStorage = multer.diskStorage({
   // destination: (req, file, cb) => {
   //   cb(null, "uploads/profile-image");
   // },
   destination: function (req: Request, file, cb) {
       let uploadPath = `uploads/${file.fieldname}`;
 
      //  if (file.fieldname === 'profile-image') {
         
      //    uploadPath = 'uploads/profile-image';
 
      //  } else if (file.fieldname === 'admin-image') {
 
      //    uploadPath = 'uploads/admin-image';
      //  }
 
       cb(null, uploadPath);
   },
 
   filename: (req, file, cb) => {
     //extract the file extension from filename
     const fileExtension = path.extname(file.originalname);
 
     const fileName = file.originalname.replace(fileExtension, "").toLowerCase().split(" ").join("-") +"-" + Date.now();
 
     cb(null, fileName + fileExtension);
   },
 });
 
 // preapre the final multer upload object
 export const uploadProfile = multer({
   storage: profileStorage,
 
   limits: {
     fileSize: 3145728, // 3MB . less than 3mb file allowed
    //  fieldSize: 3 * 1024 *1024
   },
 
   fileFilter: (req, file, cb) => {
    
       if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {
 
         cb(null, true);
 
       } else {
         cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
       }
     
   },
 });



