import BaseModel from "./BaseModel";

class Competition extends BaseModel {
  public id!: string;
  public year!: number;
  public value?: number;
  public beginDate?: Date;
  public endDate?: Date;
  public winner?: string;
  public secondWinner?: string;

  getModelName(): string {
    return 'competitions'
  }

  findAll(): Promise<Competition[]> {
    return super.findAll()
  }

  async findByYear(year: number): Promise<Competition|undefined> {
    const allCompetitions = await this.findAll();
    return allCompetitions.find(competition => competition.year === year);
  }
}

export default Competition;