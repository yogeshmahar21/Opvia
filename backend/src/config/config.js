import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT,
    databaseURI: process.env.MONGOOSE_CONNECTION_STRING,
    env : process.env.ENV,
    secret : process.env.SECRET,
};

export const config = Object.freeze(_config);