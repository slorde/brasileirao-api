import Sequelize, { Model } from 'sequelize';
import database from '../helpers/db';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public readonly createdAt!: Date;
}

User.init(
  {
    password: Sequelize.STRING,
    username: Sequelize.STRING,
  },
  {
    sequelize: database,
    freezeTableName: true,
  }
);

export default User;