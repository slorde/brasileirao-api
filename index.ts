import * as dotenv from 'dotenv'
dotenv.config();
import express from 'express';

const app = express()

app.use(express.json());
app.use('/api/users', require('./src/modules/user/route.js'));

app.listen(3000);