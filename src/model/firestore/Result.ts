import BaseModel from "./BaseModel";

class Result extends BaseModel {
  public id!: string;
  public position!: number;
  public PlayerId!: string;
  public TeamId!: string;
  public CompetitionId!: string;

  getModelName(): string {
    return 'results';
  }

  async findAll(): Promise<Result[]> {
    return super.findAll()
  }

  async findByCompetitionPlayerTeam(competitionId: string, playerId: string, teamId: string): Promise<Result | undefined> {
    const allResults = await this.findAll();
    return allResults.find(result =>
      result.CompetitionId === competitionId && result.PlayerId === playerId && result.TeamId === teamId    
    )
  }

  async findByCompetitionPlayer(competitionId: string, playerId: string): Promise<Result[]> {
    const allResults = await this.findAll();
    return allResults.filter(result =>
      result.CompetitionId === competitionId && result.PlayerId === playerId
    )
  }

  async findByCompetition(competitionId: string): Promise<Result[]> {
    const allResults = await this.findAll();
    return allResults.filter(result => result.CompetitionId === competitionId)
  }

  async delete(competitionId: string): Promise<any> {
    const results = await this.findByCompetition(competitionId);
    
    return Promise.all(results.map((r) => {
      return this.deleteById(r.id)

    }))

  }
}

export default Result;