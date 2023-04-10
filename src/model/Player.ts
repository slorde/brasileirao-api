import Sequelize, { Model } from 'sequelize';
import database from '../helpers/db';
import User from './User';

class Player extends Model {
  public id!: number;
  public name!: string;
  public UserId?: number;
}

Player.init(
  {
    name: Sequelize.STRING,
    UserId: Sequelize.INTEGER,
  },
  {
    sequelize: database,
    freezeTableName: true,
  }
);

Player.belongsTo(User);


export default Player;