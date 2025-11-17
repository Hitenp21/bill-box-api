// import { NodeEnv } from "../shared/enums/node-env.enum";
import { databaseConfig, IDatabaseConfig } from './database.config';
import { IJwtConfig, jwtConfig } from './jwt.config';
// import {
//   IPrivateStorageConfig,
//   IPublicStorageConfig,
//   privateStorageConfig,
//   publicStorageConfig,
// } from "./storage.config";

export interface Config {
  env: string;
  port: number;
  host: string;
  database: IDatabaseConfig;
  jwt: IJwtConfig;
  migrationSecret: string;
  resendApiKey: string;
  defaultEmail: string;
  backendUrl: string;
  frontendUrl: string;
  jwtExpTime: string;
  secretKey: string;
  // privateStorage: IPrivateStorageConfig;
  // publicStorage: IPublicStorageConfig;
}

export const configuration = (): Partial<Config> => ({
  env: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '3009', 10) || 3009,
  host: process.env.HOST || '127.0.0.1',
  database: databaseConfig(),
  jwt: jwtConfig(),
  backendUrl: process.env.BACKEND_URL,
  frontendUrl: process.env.FRONTEND_URL,
  secretKey: process.env.SECRET_KEY,
});
