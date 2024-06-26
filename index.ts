import * as dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('./src/modules/user/route.js'));
app.use('/api/competitions', require('./src/modules/competition/route.js'));
app.use('/api/results', require('./src/modules/result/route.js'));
app.listen(3000);