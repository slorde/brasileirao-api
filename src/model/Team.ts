import Sequelize, { Model } from 'sequelize';
import database from '../helpers/db';

class Team extends Model {
  public id!: number;
  public name!: string; 
}

Team.init(
  {
    name: Sequelize.STRING
  },
  {
    sequelize: database,
    freezeTableName: true,
  }
);

export default Team;