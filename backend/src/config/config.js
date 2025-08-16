import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT || 5000,
    databaseURI: process.env.MONGO_URI,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    secret: process.env.SECRET,
    env: process.env.ENV,
    jwt_sercret : process.env.JWT_SECRET,
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret  : process.env.API_SECRET,
};

export const config = Object.freeze(_config);