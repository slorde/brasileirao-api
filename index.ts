import * as dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import database from './src/helpers/db';

(async () => {
    try {
        await database.sync();
        console.log('Database synced');
    } catch (error) {
        console.log('Database sync error',error);
    }
})();

const app = express()

app.use(express.json());
app.use('/api/users', require('./src/modules/user/route.js'));
app.use('/api/competitions', require('./src/modules/competition/route.js'));
app.listen(3000);