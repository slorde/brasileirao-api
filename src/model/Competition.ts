import Sequelize, { Model } from 'sequelize';
import database from '../helpers/db';

class Competition extends Model {
  public id!: number;
  public year!: number;
  public value?: number;
  public beginDate?: Date;
  public endDate?: Date;
  public winner?: string;
  public secondWinner?: string;
}

Competition.init(
  {
    year: Sequelize.INTEGER,
    value: Sequelize.FLOAT,
    beginDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    winner: Sequelize.STRING,
    secondWinner: Sequelize.STRING
  },
  {
    sequelize: database,
    freezeTableName: true,
  }
);

export default Competition;