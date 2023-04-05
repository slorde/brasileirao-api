import Team from "../model/Team";

class TeamService {
    async getTeam(name: string) {
        let team = await Team.findOne({ where: { name }});
        if (!team) {
            team = Team.build({ name });
            await team.save();
        }

        return team;
    }
}

export default TeamService;