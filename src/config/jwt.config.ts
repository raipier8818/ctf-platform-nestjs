import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => (
  {
    secretKey: process.env.JWT_SECRET_KEY,
    accessTokenOptions: {
      secretKey: process.env.JWT_ACCESS_SECRET_KEY,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
    refreshTokenOptions: {
      secretKey: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }
  }
));