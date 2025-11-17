/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { Server as HTTPServer } from 'http'; // Import HTTPServer type
import app from './app';
import { errorLogger, logger } from './shared/logger';
import config from './config';
import mongoDBConnection from './connection/mongoDB';
// import seedSuperAdmin from './app/DB';
// import { initializeSocket } from './app/socket/socketManager';

let myServer: HTTPServer | undefined;

const port =
    typeof config.port === 'number' ? config.port : Number(config.port);

async function main() {
  try {
    //database connection
    mongoDBConnection();
    // logger.info('DB Connected Successfully');

    
    // myServer = server.listen(port, config.base_url as string, () => {
    //   logger.info(
    //     `Example app listening on http://${config.base_url}:${config.port}`,
    //   );
    //   seedSuperAdmin();
    // });
    myServer = app.listen(port, () => {
    //   logger.info(`Server running on http://0.0.0.0:${port}`);
    //   seedSuperAdmin();
        console.log("Server hitting : http://10.10.20.57:8001");
    });

    // Global unhandled rejection handler
    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled Rejection:', error);
    });

    process.on("uncaughtException",(error)=>{
        errorLogger.error("Uncaught Exception", error);
    });

    // Global termination signal handler
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received');
    //   if (myServer) {
    //     myServer.close(() => logger.info('Server closed gracefully'));
    //   }
    });
    // initializeSocket(myServer);
  } catch (error) {
    errorLogger.error('Error in main function:', error);
    throw error;
  }
}

// Run the main function and log errors
main().catch((err) => errorLogger.error('Main function error:', err));
