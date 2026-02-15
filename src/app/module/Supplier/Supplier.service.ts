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

    const pipeline = [
        // 1️⃣ Match supplier + today + delivered orders
        {
            $match: {
                supplier: new mongoose.Types.ObjectId(supplierId),
                status: ENUM_ORDER_STATUS.CONFIRMED, // change if your delivered enum differs
                createdAt: {
                    $gte: todayStart,
                    $lte: todayEnd,
                },
            },
        },

        // 2️⃣ Add delivery type classification
        {
            $addFields: {
            deliveryType: {
                $switch: {
                branches: [
                    {
                    case: {
                        $and: [
                            { $gt: ["$fuelQuantity", 0] },
                            { $eq: ["$dieselQuantity", 0] },
                        ],
                    },
                    then: "Fuel",
                    },
                    {
                    case: {
                        $and: [
                            { $gt: ["$dieselQuantity", 0] },
                            { $eq: ["$fuelQuantity", 0] },
                        ],
                    },
                    then: "Diesel",
                    },
                    {
                    case: {
                        $and: [
                            { $gt: ["$fuelQuantity", 0] },
                            { $gt: ["$dieselQuantity", 0] },
                        ],
                    },
                    then: "Both",
                    },
                ],
                default: "Unknown",
                },
            },
            },
        },

        // 3️⃣ Group totals
        {
            $group: {
                _id: null,

                totalFuelQuantity: { $sum: "$fuelQuantity" },
                totalFuelPrice: { $sum: "$fuelPrice" },

                totalDieselQuantity: { $sum: "$dieselQuantity" },
                totalDieselPrice: { $sum: "$dieselPrice" },

                totalOrders: { $sum: 1 },
            },
        },

        // 4️⃣ Clean output
        {
            $project: {
                _id: 0,
                totalFuelQuantity: 1,
                totalFuelPrice: 1,
                totalDieselQuantity: 1,
                totalDieselPrice: 1,
                totalOrders: 1,
            },
        },
    ]

    const pipeline2 = [
        {
            $match: {
                supplier: new mongoose.Types.ObjectId(supplierId),
                orderStatus: "Accepted",
                createdAt: {
                        $gte: todayStart,
                        $lte: todayEnd,
                    },
            }
        },
        {
            $group: {
                _id: null,
                totalFuelQuantity: { $sum: "$fuelQuantity" },
                totalDieselQuantity: { $sum: "$dieselQuantity" },
                totalOrders: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalFuelQuantity: 1,
                totalDieselQuantity: 1,
                totalOrders: 1
            }
        }
    ];

    const pipeline3 = [
        // 1️⃣ Match today's orders for supplier
        {
            $match: {
                supplier: new mongoose.Types.ObjectId(supplierId),
                createdAt: {
                    $gte: todayStart,
                    $lte: todayEnd,
                },
                orderStatus: { $in: ["Accepted", "Confirmed"] }
            },
        },

        // 2️⃣ Group by orderStatus
        {
            $group: {
            _id: "$orderStatus",

            totalFuelQuantity: {
                $sum: { $ifNull: ["$fuelQuantity", 0] }
            },

            totalDieselQuantity: {
                $sum: { $ifNull: ["$dieselQuantity", 0] }
            },

            totalFuelPrice: {
                $sum: { $ifNull: ["$fuelPrice", 0] }
            },

            totalDieselPrice: {
                $sum: { $ifNull: ["$dieselPrice", 0] }
            },

            totalOrders: { $sum: 1 }
            },
        },

        // 3️⃣ Restructure into single clean object
        {
            $group: {
            _id: null,
            data: {
                $push: {
                status: "$_id",
                fuelQuantity: "$totalFuelQuantity",
                dieselQuantity: "$totalDieselQuantity",
                fuelPrice: "$totalFuelPrice",
                dieselPrice: "$totalDieselPrice",
                totalOrders: "$totalOrders"
                }
            }
            }
        },

        {
            $project: {
            _id: 0,
            accepted: {
                $first: {
                $filter: {
                    input: "$data",
                    as: "item",
                    cond: { $eq: ["$$item.status", "Accepted"] }
                }
                }
            },
            confirmed: {
                $first: {
                $filter: {
                    input: "$data",
                    as: "item",
                    cond: { $eq: ["$$item.status", "Confirmed"] }
                }
                }
            }
            }
        }
    ];



    const [supplierTodayStats, supplier, acceptedOrderTotal] = await Promise.all([
            OrderModel.aggregate(pipeline3),
            SupplierModel.findById(profileId).select("name email todayFuelRate todayDieselRate").lean(),
            OrderModel.aggregate(pipeline2)
    ]);
    // await SupplierModel.findById(profileId).select("name email todayFuelRate todayDieselRate");

    console.log(acceptedOrderTotal);

    return {supplierCompletedDelivery: supplierTodayStats ,supplierTodayRate: supplier, acceptedOrderTotal: acceptedOrderTotal[0] || { totalFuelQuantity: 0, totalDieselQuantity: 0, totalOrders: 0 }};

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

    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);

    const supplier = new mongoose.Types.ObjectId(profileId);

    const baseMatch = {
        supplier,
        status: ENUM_ORDER_STATUS.COMPLETED,
    };



    if(time == "this-week"){
        const weeklyData = await OrderModel.aggregate([
            {
                $match: {
                ...baseMatch,
                createdAt: {
                    $gte: last7Days,
                    $lte: today,
                },
                },
            },
            {
                $group: {
                _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                },
                totalRevenue: { $sum: "$totalPrice" },
                },
            },
            {
                $project: {
                _id: 0,
                day: "$_id.day",
                totalRevenue: 1,
                },
            },
            {
                $sort: { day: 1 },
            },
        ]);

        return weeklyData;

    }
    else if(time == "this-month"){
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 29);

        const monthlyData = await OrderModel.aggregate([
            {
                $match: {
                ...baseMatch,
                createdAt: {
                    $gte: last30Days,
                    $lte: today,
                },
                },
            },
            {
                $group: {
                _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                },
                totalRevenue: { $sum: "$totalPrice" },
                },
            },
            {
                $project: {
                _id: 0,
                day: "$_id.day",
                totalRevenue: 1,
                },
            },
            {
                $sort: { day: 1 },
            },
        ]);

        return monthlyData;

    }
    if(time == "this-year"){
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const yearlyData = await OrderModel.aggregate([
            {
                $match: {
                ...baseMatch,
                createdAt: {
                    $gte: startOfYear,
                    $lte: today,
                },
                },
            },
            {
                $group: {
                _id: { $month: "$createdAt" },
                totalRevenue: { $sum: "$totalPrice" },
                },
            },
            {
                $project: {
                _id: 0,
                month: "$_id",
                totalRevenue: 1,
                },
            },
            {
                $sort: { month: 1 },
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