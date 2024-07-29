import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT) || 3000,
  env: process.env.APP_ENV || 'development',
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin',
    email: process.env.ADMIN_EMAIL || 'test@example.com',
    role: 'admin'
  }
}));