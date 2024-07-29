import { registerAs } from "@nestjs/config";

export default registerAs('mongoose', () => ({
  uri: process.env.MONGOOSE_DB_URI,
  name: process.env.MONGOOSE_DB_NAME,
}));
