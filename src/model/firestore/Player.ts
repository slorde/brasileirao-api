import BaseModel from "./BaseModel";

class Player extends BaseModel {
  public id!: string;
  public name!: string;
  public UserId?: string;

  getModelName(): string {
    return 'players'
  }

  async findAll(): Promise<Player[]> {
    return super.findAll()
  }

  async findByName(name: string): Promise<Player|undefined> {
    const allPlayers = await this.findAll();
    return allPlayers.find(player => player.name === name);
  }

  async findByUserId(userId: string): Promise<Player|undefined> {
    const allPlayers = await this.findAll();
    return allPlayers.find(player => player.UserId === userId);
  }
}

export default Player;