import Sequelize, { Model } from 'sequelize';
import database from '../helpers/db';

class Competition extends Model {
  public id!: number;
  public year!: number;
  public value?: number;
  public beginDate?: Date;
  public endDate?: Date;
}

Competition.init(
  {
    year: Sequelize.INTEGER,
    value: Sequelize.FLOAT,
    beginDate: Sequelize.DATE,
    endDate: Sequelize.DATE
  },
  {
    sequelize: database,
    freezeTableName: true,
  }
);

export default Competition;