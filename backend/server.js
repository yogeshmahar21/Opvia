import app from './src/app.js';
import { config } from './src/config/config.js';
import connectToDb from './src/config/db.js';

const startServer = async() => {

    await connectToDb();

    const port = config.port || 5000;

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    })
}

startServer();