import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT || 5000,
    databaseURI: process.env.MONGO_URI,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    secret: process.env.SECRET,
    env: DEVELOPMENT
};

export const config = Object.freeze(_config);