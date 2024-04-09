import Team from "../model/firestore/Team";

class TeamService {
    private modelTeam;
    constructor() {
        this.modelTeam = new Team();
    }
    async getTeam(name: string): Promise<Team> {
        let team = await this.modelTeam.findByName(name);
        if (!team) {
            return this.modelTeam.create({ name });
        }
        return team;
    }

    async getTeamById(id: string) {
        return this.modelTeam.findById(id);
    }
}

export default TeamService;