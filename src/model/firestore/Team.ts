import BaseModel from "./BaseModel";

class Team extends BaseModel {
  public id!: string;
  public name!: string; 

  getModelName(): string {
    return 'teams'
  }

  async findAll(): Promise<Team[]> {
    return super.findAll()
  }

  async findByName(name: string): Promise<Team|undefined> {
    const allTeams = await this.findAll();
    return allTeams.find(team => team.name === name);
  }
}
export default Team;