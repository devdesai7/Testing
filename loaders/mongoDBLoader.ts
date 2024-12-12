import { env } from '../env';
const configs = {
  username: env.mongodb.username,
  password: env.mongodb.password,
  appName: env.mongodb.appName,
  host: env.mongodb.host,
  port: env.mongodb.port,
  dbName: env.mongodb.dbName,
};

import mongoose from 'mongoose';
export default () => {
  const mongoconnect = () => {
    mongoose
      .connect(
        `mongodb+srv://${configs.username}:${configs.password}@${configs.host}/${configs.dbName}?retryWrites=true&w=majority&appName=${configs.appName}`,
      )
      .then(() => {
        return console.info(
          `Successfully connected to DB Server - uri: ${configs.host}`,
        );
      })
      .catch((error) => {
        console.log(error);
        return process.exit(1);
      });
  };
  mongoconnect();
  mongoose.connection.on('disconnected', mongoconnect);
};
