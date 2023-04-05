import { Sequelize } from 'sequelize';
const connection = new Sequelize(process.env.DB_PATH || '', {dialect: 'postgres'}); 

export default connection;