import BaseModel from "./BaseModel";

class User extends BaseModel {
  public id!: string;
  public username!: string;
  public password!: string;
  public readonly createdAt!: Date;

  getModelName(): string {
    return 'users';
  }

  async findAll(): Promise<User[]> {
    return super.findAll()
  }

  async findByUserName(name: string): Promise<User|undefined> {
    const allUsers = await this.findAll();
    return allUsers.find(user => user.username === name);
  }
}

export default User;