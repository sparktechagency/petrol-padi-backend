// import { Server } from "socket.io";
// import http from "http";

// let io: Server;

// export const initSocket = (server: http.Server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*", // restrict in production
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("join", (userId: string) => {
//       socket.join(userId);
//       console.log(`User joined room: ${userId}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// export const getIO = () => {
//   if (!io) throw new Error("Socket.io not initialized");
//   return io;
// };


// npm install socket.io
// npm install -D @types/socket.io

//attach socket.io to existing http server
// import http from "http";
// import app from "./app";
// import { initSocket } from "./socket";

// const server = http.createServer(app);

// initSocket(server);

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


//emit notification to specific user
//create notification and emit via socket.io
// import NotificationModel from "./notification.model";
// import { getIO } from "../socket";

// export const createNotification = async (
//   toId: string,
//   title: string
// ) => {
//   const notification = await NotificationModel.create({
//     toId,
//     title,
//   });

//   const io = getIO();

//   // 🔥 Emit to specific user room
//   io.to(toId).emit("new-notification", notification);

//   return notification;
// };

//call notification service from anywhere in the app
// await createNotification(
//   customerId,
//   "Your order has been placed successfully"
// );


