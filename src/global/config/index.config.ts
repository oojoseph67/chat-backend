import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT, 10) || 7321,
  apiVersion: process.env.API_VERSION || 'v1',
}));
