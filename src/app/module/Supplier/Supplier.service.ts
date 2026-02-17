import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import { ENUM_FUEL_TYPE, ENUM_ORDER_STATUS } from "../../../utilities/enum";
import UserModel from "../User/User.model";
import { addFuelRate, ISupplier } from "./Supplier.interface";
import SupplierModel from "./Supplier.model";
import deleteOldFile from "../../../utilities/deleteFile";
import OrderModel from "../Order/Order.model";
import mongoose from "mongoose";

// const findLowestHighestFuelRateService = async (locationQuery: Record<string,unknown>) => {

//     //if filter is needed by location then have to add filter by location
//     //location default value will be customer's own location/city
//     const { location, latitude,longitude } = locationQuery;

//     const queryparameters = {
//         // creator: { $ne: new mongoose.Types.ObjectId(userId) },
//         // status: ENUM_POST_STATUS.PENDING, // not my post
//         location: {
//             $nearSphere: {
//             $geometry: {
//                 type: "Point",
//                 coordinates: [longitude, latitude],
//             },
//             $maxDistance: 50 * 1000,
//             }
//         }
//     }
//     //highest and lowest rate fuel
//     const result = await SupplierModel.aggregate([
//         {
//             $match: {
//                 location: { $regex: location, $options: "i" } // case-insensitive match
//             }
//         },
//         {
//             $facet: {
//                 lowestFuelRate: [
//                     { $sort: { todayFuelRate: 1 } },
//                     { $limit: 1 },
//                     {
//                         $project: {
//                             _id: 0,
//                             name: 1,
//                             todayFuelRate: 1
//                         }
//                     }
//                 ],
//                 highestFuelRate: [
//                     { $sort: { todayFuelRate: -1 } },
//                     { $limit: 1 },
//                     {
//                         $project: {
//                             _id: 0,
//                             name: 1,
//                             todayFuelRate: 1
//                         }
//                     }
//                 ],
//                 lowestDieselRate: [
//                     { $sort: { todayDieselRate: 1 } },
//                     { $limit: 1 },
//                     {
//                         $project: {
//                             _id: 0,
//                             name: 1,
//                             todayDieselRate: 1
//                         }
//                     }
//                 ],
//                 highestDieselRate: [
//                     { $sort: { todayDieselRate: -1 } },
//                     { $limit: 1 },
//                     {
//                         $project: {
//                             _id: 0,
//                             name: 1,
//                             todayDieselRate: 1
//                         }
//                     }
//                 ],
//             }
//         }
//     ]);

//     //all supplier around customer filtered by city
//     const suppliers = await SupplierModel.aggregate([
//         {
//             $match: {
//                 location: { $regex: location, $options: "i" }, // case-insensitive match
//                 isApproved: true
//             }
//         },
//         {
//             $sort:{ todayFuelRate: 1 }
//         },
//         {
//             $project: {
//                 _id: 1,
//                 name: 1,
//                 // email: 1,
//                 // phone: 1,
//                 // image: 1,
//                 location: 1,
//                 // latitude: 1,
//                 // longitude: 1,
//                 todayFuelRate: 1,
//                 todayDieselRate: 1
//             }
//         }
//     ]);

//     return {result,suppliers}
    
// };



// const findLowestHighestFuelRateService = async ( locationQuery: Record<string, unknown> ) => {
//   const { location, latitude, longitude, radius = 50 } = locationQuery as {
//     location?: string;
//     latitude?: number;
//     longitude?: Number;
//     radius?: Number;
//   };

//   console.log(locationQuery);

//   const hasGeo = latitude && longitude;

//   /**
//    * -----------------------------
//    * BASE MATCH (text + approval)
//    * -----------------------------
//    */
//   const textMatch: any = {
//     isApproved: true
//   };

//   if (location) {
//     textMatch.location.address = { $regex: location, $options: "i" };
//   }

// //   const radiusKm = Number(radius);

// //     const safeRadius = Number.isFinite(radiusKm) && radiusKm > 0
// //     ? radiusKm * 1000
// //     : 50000; // default 50km


//   /**
//    * -----------------------------
//    * GEO STAGE (only if lat/lng)
//    * -----------------------------
//    */
// //   const geoStage = hasGeo
// //     ? 
// //         {
// //           $geoNear: {
// //             near: {
// //               type: "Point",
// //               coordinates: [longitude!, latitude!],
// //             },
// //             distanceField: "distance",
// //             maxDistance: radius * 1000, // km → meters
// //             spherical: true,
// //             query: textMatch,
// //           },
// //         },
      
// //     : [{ $match: textMatch.location }];

//   /**
//    * -----------------------------
//    * HIGHEST / LOWEST RATES
//    * -----------------------------
//    */
//   const lng = Number(longitude);
// const lat = Number(latitude);

// if (isNaN(lng) || isNaN(lat)) {
//   throw new ApiError(400, "Invalid latitude or longitude");
// }

// // const radiusInMeters =
// //   typeof safeRadius === "number" && safeRadius > 0
// //     ? safeRadius
// //     : 50000;

// const result = await SupplierModel.aggregate([
//   {
//     $geoNear: {
//       near: {
//         type: "Point",
//         coordinates: [lng, lat], // ✅ MUST be numbers
//       },
//     //   near: [lng, lat],
//       distanceField: "distance",
//     //   maxDistance: radiusInMeters, // ✅ > 0 always
//       spherical: true,
//       query: textMatch, // ✅ extra filters live here
//     },
//   },
//   {
//   $match: {
//     distance: { $lte: radius as any * 1000 } // in meters
//   }
// },
//   {
//     $facet: {
//       lowestFuelRate: [
//         { $sort: { todayFuelRate: 1 } },
//         { $limit: 1 },
//         { $project: { _id: 0, name: 1, todayFuelRate: 1 } },
//       ],
//       highestFuelRate: [
//         { $sort: { todayFuelRate: -1 } },
//         { $limit: 1 },
//         { $project: { _id: 0, name: 1, todayFuelRate: 1 } },
//       ],
//       lowestDieselRate: [
//         { $sort: { todayDieselRate: 1 } },
//         { $limit: 1 },
//         { $project: { _id: 0, name: 1, todayDieselRate: 1 } },
//       ],
//       highestDieselRate: [
//         { $sort: { todayDieselRate: -1 } },
//         { $limit: 1 },
//         { $project: { _id: 0, name: 1, todayDieselRate: 1 } },
//       ],
//     },
//   },
// ]);


//   /**
//    * -----------------------------
//    * SUPPLIERS LIST
//    * -----------------------------
//    */
//   const suppliers = await SupplierModel.aggregate([
//     // ...geoStage,
//      {
//     $geoNear: {
//       near: {
//         type: "Point",
//         coordinates: [lng, lat], // ✅ MUST be numbers
//       },
//     //   near: [lng, lat],
//       distanceField: "distance",
//     //   maxDistance: radiusInMeters, // ✅ > 0 always
//       spherical: true,
//       query: textMatch, // ✅ extra filters live here
//     },
//   },
//   {
//   $match: {
//     distance: { $lte: radius as any * 1000 } // in meters
//   }
// },
//     { $sort: { todayFuelRate: 1 } },
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         location: 1,
//         todayFuelRate: 1,
//         todayDieselRate: 1,
//         distance: hasGeo ? 1 : 0,
//       },
//     },
//   ]);

//   return { result, suppliers };
// };

/**
 * Find approved suppliers within radius + compute min/max fuel & diesel rates
 * Uses $geoWithin + aggregation for efficient stats
 */
const findNearbySuppliersWithRateStats = async (query: Record<string, unknown>) => {
    const { latitude, longitude, radiusKm = 30, includeUnapproved = false, maxResults = 20 } = query;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("Invalid latitude or longitude");
    }


  const radiusInRadians = radiusKm as any / 6378.1; // Earth radius ≈ 6378.1 km

  const geoCondition = {
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusInRadians],
      },
    },
  };

  const match: any = {
    ...geoCondition,
    isApproved: true,
    todayFuelRate: { $gt: 0 },     // optional: exclude 0/invalid rates
    todayDieselRate: { $gt: 0 },
  };

//   if (includeUnapproved) {
//     delete match.isApproved;
//   }

  
    const pipeline = [
      { $match: match },

      // We branch here — one path for list, one for stats
      {
        $facet: {
          // A. List of suppliers (limited)
          suppliers: [
            { $sort: { averageRating: -1, todayFuelRate: 1 } }, // your preferred sort
            // { $limit: maxResults },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                phone: 1,
                image: 1,
                address: 1,
                location: 1,
                todayFuelRate: 1,
                todayDieselRate: 1,
                todayFuelStock: 1,
                todayDieselStock: 1,
                totalRating: 1,
                averageRating: 1,
                isApproved: 1,
              },
            },
          ],

          // B. Stats — min & max for fuel and diesel
          stats: [
            {
              $group: {
                _id: null,
                minFuel: { $min: '$todayFuelRate' },
                maxFuel: { $max: '$todayFuelRate' },
                minDiesel: { $min: '$todayDieselRate' },
                maxDiesel: { $max: '$todayDieselRate' },

                minFuelDoc: {
                  $min: {
                    rate: '$todayFuelRate',
                    name: '$name',
                    _id: '$_id',
                  },
                },
                maxFuelDoc: {
                  $max: {
                    rate: '$todayFuelRate',
                    name: '$name',
                    _id: '$_id',
                  },
                },
                minDieselDoc: {
                  $min: {
                    rate: '$todayDieselRate',
                    name: '$name',
                    _id: '$_id',
                  },
                },
                maxDieselDoc: {
                  $max: {
                    rate: '$todayDieselRate',
                    name: '$name',
                    _id: '$_id',
                  },
                },

                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                fuel: {
                  min: {
                    $cond: [
                      { $eq: ['$minFuel', null] },
                      null,
                      { rate: '$minFuelDoc.rate', supplierName: '$minFuelDoc.name', supplierId: '$minFuelDoc._id' },
                    ],
                  },
                  max: {
                    $cond: [
                      { $eq: ['$maxFuel', null] },
                      null,
                      { rate: '$maxFuelDoc.rate', supplierName: '$maxFuelDoc.name', supplierId: '$maxFuelDoc._id' },
                    ],
                  },
                },
                diesel: {
                  min: {
                    $cond: [
                      { $eq: ['$minDiesel', null] },
                      null,
                      { rate: '$minDieselDoc.rate', supplierName: '$minDieselDoc.name', supplierId: '$minDieselDoc._id' },
                    ],
                  },
                  max: {
                    $cond: [
                      { $eq: ['$maxDiesel', null] },
                      null,
                      { rate: '$maxDieselDoc.rate', supplierName: '$maxDieselDoc.name', supplierId: '$maxDieselDoc._id' },
                    ],
                  },
                },
              },
            },
          ],
        },
      },

      // Final shaping
      {
        $project: {
          suppliers: '$suppliers',
          stats: { $arrayElemAt: ['$stats', 0] },
          count: { $arrayElemAt: ['$stats.count', 0] },
        },
      },
    ];

    const [result] = await SupplierModel.aggregate(pipeline as any).exec();
    // console.log(result);
    if (!result) {
      return {
        suppliers: [],
        stats: {
          fuel: { min: null, max: null },
          diesel: { min: null, max: null },
        },
        count: 0,
        searchedFrom: { latitude, longitude, radiusKm },
      };
    }

    return {
      suppliers: result.suppliers || [],
      stats: result.stats || {
        fuel: { min: null, max: null },
        diesel: { min: null, max: null },
      },
      count: result.count || 0,
      searchedFrom: { latitude, longitude, radiusKm },
    };

}


const searchSupplierByNameService = async (nameQuery: Record<string,unknown>) => {

    const suppliers = await SupplierModel.find({
        name: { $regex: nameQuery.name, $options: "i" }, // case-insensitive match
        isApproved: true
    }).select("name email phone image location address todayFuelRate todayDieselRate todayFuelStock todayDieselStock totalRating averageRating").lean();

    return suppliers;
}

const supplierDetailService = async (userDetails: JwtPayload) => {

    const {profileId: supplierId} = userDetails;

    if(!supplierId){
        throw new ApiError(400,"Supplier is is required to get supplier details");
    }

    const supplier = await SupplierModel.findById(supplierId).lean();

    let result = {};

    // if(fuelType === ENUM_FUEL_TYPE.FUEL){

    // }

    // else if(fuelType === ENUM_FUEL_TYPE.DIESEL){

    // }

    //get supplier rating
    //get all review from review collection and then calculate avg and total rating
    //or everytime new rating is added determine avg and total and keep it with supplier

    return supplier;
}

const addFuelRateService = async (userDetails: JwtPayload,payload: addFuelRate) => {
    const {profileId} = userDetails;
    const {todayFuelRate, todayDieselRate, fuelType} = payload;

    let supplier;

    if(fuelType === ENUM_FUEL_TYPE.FUEL){
        supplier = await SupplierModel.findByIdAndUpdate(profileId,{
            todayFuelRate: todayFuelRate
        },{new: true});
    }
    else if(fuelType === ENUM_FUEL_TYPE.DIESEL){
        supplier = await SupplierModel.findByIdAndUpdate(profileId,{
            todayDieselRate: todayDieselRate
        },{new: true});
    }

    if(!supplier){
        throw new ApiError(500,"Failed to add fuel rate");
    }

    return {todayFuelRate: supplier.todayFuelRate, todayDieselRate: supplier.todayDieselRate};
    
}

const getFuelRateService = async (userDetails: JwtPayload) => {
    const {profileId} = userDetails;

    //get today total fuel, disel order, deliverys and earnings for supplier

   const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const supplierId = new mongoose.Types.ObjectId(profileId);

    const pipeline4 = [
        {
            $match: {
                supplier: supplierId,
                createdAt: {
                    $gte: todayStart,
                    $lte: todayEnd,
                },
            },
        },

        {
            $facet: {

                // 🔵 1️⃣ Accepted + On_The_Way + Completed
                activeOrders: [
                    {
                    $match: {
                        status: {
                            $in: [
                                "Accepted",
                                "On_The_Way",
                                "Completed",
                                "Confirmed"
                            ]
                        }
                    }
                    },
                    {
                    $group: {
                        _id: null,

                        fuelCount: {
                            $sum: {
                                $cond: [{ $gt: ["$fuelQuantity", 0] }, 1, 0]
                            }
                        },

                        dieselCount: {
                            $sum: {
                                $cond: [{ $gt: ["$dieselQuantity", 0] }, 1, 0]
                            }
                        },

                        totalCount: { $sum: 1 }
                    }
                    },
                    { $project: { _id: 0 } }
                ],

                // 🟢 2️⃣ Confirmed Orders
                confirmedOrders: [
                    {
                        $match: {
                            status: "Confirmed"
                        }
                    },
                    {
                        $group: {
                            _id: null,

                            fuelCount: {
                                $sum: {
                                    $cond: [{ $gt: ["$fuelQuantity", 0] }, 1, 0]
                                }
                            },

                            dieselCount: {
                                $sum: {
                                    $cond: [{ $gt: ["$dieselQuantity", 0] }, 1, 0]
                                }
                            },

                            fuelRevenue: {
                                $sum: { $ifNull: ["$fuelPrice", 0] }
                            },

                            dieselRevenue: {
                                $sum: { $ifNull: ["$dieselPrice", 0] }
                            },

                            totalCount: { $sum: 1 }
                        }
                    },
                    { $project: { _id: 0 } }
                ]
            }
        },

        // Clean final response
        {
            $project: {
                totalOrders: { $arrayElemAt: ["$activeOrders", 0] },
                confirmedOrders: { $arrayElemAt: ["$confirmedOrders", 0] }
            }
        }
    ];



    const [supplierTodayStats, supplier] = await Promise.all([
            OrderModel.aggregate(pipeline4),
            SupplierModel.findById(profileId).select("name email todayFuelRate todayDieselRate").lean(),
            // OrderModel.aggregate(pipeline2)
    ]);
    // await SupplierModel.findById(profileId).select("name email todayFuelRate todayDieselRate");

    // console.log(supplierTodayStats,supplierTodayStats);

    return {
        supplierTodayStats: supplierTodayStats[0] || { 
            totalOrders: {
                fuelCount: 0,
                dieselCount: 0,
                totalCount: 0
            }, confirmedOrders: {
                fuelCount: 0,
                dieselCount: 0,
                fuelRevenue: 0,
                dieselRevenue: 0,
                totalCount: 0

            } 
        },
        supplierTodayRate: supplier || {
            name: "", email: "", todayFuelRate: 0, todayDieselRate: 0 
        },
        // acceptedOrderTotal
    }

}

const uploadDocumentService = async (userDetails: JwtPayload, file: Express.Multer.File | undefined) => {
    const {profileId} = userDetails;

    const supplier = await SupplierModel.findById(profileId).select("name email document");

    // Handle image update
  if (file) {
    if (supplier.document) deleteOldFile(supplier.document as string);
    supplier.document = `uploads/supplier-file/${file.filename}`;
  }

  await supplier.save();

  return supplier;

}

const supplierRevenueService = async (userDetails: JwtPayload, query: Record<string,unknown>) => {
    const {profileId} = userDetails;
    let {time} = query;

    // const today = new Date();
    // const last7Days = new Date();
    // last7Days.setDate(today.getDate() - 6);

    const supplier = new mongoose.Types.ObjectId(profileId);

    const baseMatch = {
        supplier,
        status: ENUM_ORDER_STATUS.CONFIRMED,
    };

    const now = new Date();
    let startDate: Date;

    switch (time) {

        case "this-week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6); // last 7 days including today
        break;

        
        case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
        
        case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;

        default:
        throw new ApiError(400,"Invalid time.");

    }



    if(time == "this-week"){
        

        const weeklyData = await OrderModel.aggregate( [
        {
            $match: {
            supplier: new mongoose.Types.ObjectId(supplier),
            status: "Confirmed",
            createdAt: {
                $gte: startDate,
                $lte: now,
            },
            },
        },

        {
            $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
            },

            fuelQuantity: { $sum: { $ifNull: ["$fuelQuantity", 0] } },
            fuelRevenue: { $sum: { $ifNull: ["$fuelPrice", 0] } },

            dieselQuantity: { $sum: { $ifNull: ["$dieselQuantity", 0] } },
            dieselRevenue: { $sum: { $ifNull: ["$dieselPrice", 0] } },
            },
        },

        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },

        {
            $project: {
            _id: 0,
            date: {
                $dateToString: {
                format: "%Y-%m-%d",
                date: {
                    $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day",
                    },
                },
                },
            },
            fuelQuantity: 1,
            fuelRevenue: 1,
            dieselQuantity: 1,
            dieselRevenue: 1,
            },
        },
        ]);
        console.log(weeklyData);
        return weeklyData;


    }
    else if(time == "this-month"){
       

    const monthLyData = await OrderModel.aggregate( [
        {
            $match: {
            supplier: new mongoose.Types.ObjectId(supplier),
            status: "Confirmed",
            createdAt: {
                $gte: startDate,
                $lte: now,
            },
            },
        },

        {
            $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
            },

            fuelQuantity: { $sum: { $ifNull: ["$fuelQuantity", 0] } },
            fuelRevenue: { $sum: { $ifNull: ["$fuelPrice", 0] } },

            dieselQuantity: { $sum: { $ifNull: ["$dieselQuantity", 0] } },
            dieselRevenue: { $sum: { $ifNull: ["$dieselPrice", 0] } },
            },
        },

        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },

        {
            $project: {
            _id: 0,
            date: {
                $dateToString: {
                format: "%Y-%m-%d",
                date: {
                    $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day",
                    },
                },
                },
            },
            fuelQuantity: 1,
            fuelRevenue: 1,
            dieselQuantity: 1,
            dieselRevenue: 1,
            },
        },
        ]);

        return monthLyData;
    }
    if(time == "this-year"){
        

        const yearlyData = await OrderModel.aggregate( [
        // 1️⃣ Match supplier + confirmed + this year
        {
            $match: {
            supplier: new mongoose.Types.ObjectId(supplier),
            status: "Confirmed",
            createdAt: {
                $gte: startDate,
                $lte: now,
            },
            },
        },

        // 2️⃣ Group by month
        {
            $group: {
            _id: { $month: "$createdAt" },

            fuelQuantity: {
                $sum: { $ifNull: ["$fuelQuantity", 0] }
            },

            fuelRevenue: {
                $sum: { $ifNull: ["$fuelPrice", 0] }
            },

            dieselQuantity: {
                $sum: { $ifNull: ["$dieselQuantity", 0] }
            },

            dieselRevenue: {
                $sum: { $ifNull: ["$dieselPrice", 0] }
            },
            },
        },

        // 3️⃣ Sort by month number
        {
            $sort: { _id: 1 }
        },

        // 4️⃣ Convert month number to month name
        {
            $project: {
            _id: 0,
            month: {
                $arrayElemAt: [
                [
                    "", 
                    "January", "February", "March", "April",
                    "May", "June", "July", "August",
                    "September", "October", "November", "December"
                ],
                "$_id"
                ]
            },

            fuelQuantity: 1,
            fuelRevenue: 1,
            dieselQuantity: 1,
            dieselRevenue: 1,
            },
        },
        ]);

        return yearlyData;

    }
}

//dashboard

const getSupplierRequestService = async (query: Record<string,unknown>) => {
    let {page, searchText} = query;
    
    if(searchText){
        const searchedSupplier = await SupplierModel.find({
            $or: [
                { name: { $regex: searchText as string, $options: "i" } },
                { email: { $regex: searchText as string, $options: "i" } },
            ],
            isApproved: false
        }).select("user name email phone image location document createdAt").lean();
        
        return {
            meta:{ page, limit: 10, total: searchedSupplier.length, totalPage: 1 },
            allSupplier: searchedSupplier
        };
    }
    
    //add pagination later  
    page =  Number(page) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;

    const [ allSupplier, totalSuppliers ] = await Promise.all([
        SupplierModel.find({isApproved: false}).select("user name email phone image location document createdAt")
            .sort({ createdAt: -1 })
                .skip(skip).limit(limit).lean(),
        SupplierModel.countDocuments({isApproved: false}),
    ]);

    const totalPage = Math.ceil(totalSuppliers / limit);
     

    return {
        meta:{ page,limit: 10,total: totalSuppliers, totalPage },
        allSupplier
    };

    // const allRequest = await SupplierModel.find({isApproved: false}).select("user name email phone image location document createdAt").lean();

    // return allRequest;
}

const getAllSupplierService = async (query: Record<string,unknown>) => {

    let {page, searchText} = query;
    
    if(searchText){
        const searchedSupplier = await SupplierModel.find({
            $or: [
                { name: { $regex: searchText as string, $options: "i" } },
                { email: { $regex: searchText as string, $options: "i" } },
            ],
            isApproved: true
        }).select("user name email phone image location document createdAt").lean();
        
       return {
            meta:{ page: Number(page) || 1,limit: 10,total: searchedSupplier.length, totalPage: 1 },
            allSupplier: searchedSupplier
        };
    }
    
    //add pagination later  
    page =  Number(page) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;

    const [ allSupplier, totalSuppliers ] = await Promise.all([
        SupplierModel.find({isApproved: true}).select("user name email phone image location document createdAt")
            .sort({ createdAt: -1 })
                .skip(skip).limit(limit).lean(),
        SupplierModel.countDocuments({isApproved: true}),
    ]);

    const totalPage = Math.ceil(totalSuppliers / limit);
     

    return {
        meta:{ page,limit: 10,total: totalSuppliers, totalPage },
        allSupplier
    };

    // const allRequest = await SupplierModel.find({isApproved: true}).select("user name email phone image location createdAt").lean();

    // return allRequest;
}

const getSupplierDetailsService = async (id: string) => {

    const supplier = await SupplierModel.findById(id).select("name email phone image location bankName accountName accountNumber").lean();

    if(!supplier){
        throw new ApiError(404,"No supplier detail found.");
    }

    return supplier;
}

const approveSupplierService = async (id: string) =>{

    const approvedSupplier = await SupplierModel.findByIdAndUpdate(id,{isApproved: true},{new:true});

    if(!approvedSupplier.isApproved){
        throw new ApiError(500,"Failed to approve this supplier");
    }

    return {name: approvedSupplier.name, email: approvedSupplier.email, phone: approvedSupplier.phone, iaApproved: approvedSupplier.isApproved};
}

const deleteSupplierService = async (id: string) =>{

    const supplier: any = await SupplierModel.findById(id).lean();

    if(!supplier){
        throw new ApiError(404, "Supplier not found to delete.");
    }

    //delete both supplier and user
    const [deletedUser,deletedSupplier] = await Promise.all([
        UserModel.findByIdAndDelete(supplier?.user),
        SupplierModel.findByIdAndDelete(id)
    ]);

    if(!deletedSupplier || !deletedUser){
        throw new ApiError(500,"Failed to delete supplier.");
    }
}


const SupplierServices = { 
    // findLowestHighestFuelRateService,
    findNearbySuppliersWithRateStats,
    searchSupplierByNameService,
    supplierDetailService,
    addFuelRateService,
    getFuelRateService,
    uploadDocumentService,
    supplierRevenueService,
    getAllSupplierService,
    getSupplierRequestService,
    getSupplierDetailsService,
    approveSupplierService,
    deleteSupplierService
 };
export default SupplierServices;