import Sequelize, { Model } from 'sequelize';
import database from '../helpers/db';
import Team from './Team';
import Player from './Player';
import Competition from './Competition';

class Result extends Model {
  public id!: number;
  public position!: number;
  public PlayerId!: number;
  public TeamId!: number;
  public CompetitionId!: number; 
}

Result.init(
  {
    position: Sequelize.INTEGER,
    PlayerId: Sequelize.INTEGER,
    TeamId: Sequelize.INTEGER,
    CompetitionId: Sequelize.INTEGER
  },
  {
    sequelize: database,
    freezeTableName: true,
  }
);

Result.belongsTo(Team);
Result.belongsTo(Player);
Result.belongsTo(Competition);

export default Result;