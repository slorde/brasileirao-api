import fetch from 'cross-fetch';
import Result from "../model/Result";
import PlayerService from "./player-service";
import TeamService from "./team-service";
import Player from '../model/Player';

type ApiFutebol = {
    posicao: number,
    time: { nome_popular: string }
}

type Standings = {
    position: number,
    team: string
}

type PlayerParam = {
    userId: number,
    playerName: string,
    ignoreUser: boolean
}

class ResultService {
    private playerService;
    private teamService;
    constructor() {
        this.playerService = new PlayerService();
        this.teamService = new TeamService();
    }

    async updateResults(competitionId: number) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.API_FUTEBOL_KEY}`
            }
        };
        const response = await fetch('https://api.api-futebol.com.br/v1/campeonatos/10/tabela', options);
        const data: any = await response.json();

        const player = await this.playerService.getResultPlayer();
        return Promise.all(data.map(async (team: ApiFutebol) => {
            const teamName = team.time.nome_popular;
            const position = team.posicao;

            const teamData = await this.teamService.getTeam(teamName);
            let resultData = await Result.findOne({
                where: {
                    CompetitionId: competitionId,
                    PlayerId: player?.id,
                    TeamId: teamData.id
                }
            });

            if (!resultData) {
                resultData = Result.build({
                    CompetitionId: competitionId,
                    PlayerId: player?.id,
                    TeamId: teamData.id
                });
            }

            resultData.position = position;
            await resultData.save();
        }));
    }

    async getResultsTeams(competitionId: number, userId: number) {
        const player = await this.playerService.getUserPlayer(userId, 'error');
        const results = await Result.findAll({ where: { CompetitionId: competitionId, PlayerId: player.id } });

        const resultPlayer = await this.playerService.getResultPlayer();
        const resultPlayerResults = await Result.findAll({ where: { CompetitionId: competitionId, PlayerId: resultPlayer.id } });

        if (resultPlayerResults.length !== results.length) {
            const teams = await Promise.all(resultPlayerResults
                .map(async (r) => {
                    const team = await this.teamService.getTeamById(r.TeamId);
                    return team?.name;
                }));
            return teams.sort();
        }

        return Promise.all(results
            .sort((a, b) => a.position - b.position)
            .map(async (r) => {
                const team = await this.teamService.getTeamById(r.TeamId);
                return team?.name;
            }));
    }

    async resultDetail(competitionId: number, returnResults: boolean = true, filterUsers?: boolean) {
        const query: any = { where: { CompetitionId: competitionId } };
        if (filterUsers) {
            const players = await this.playerService.getUserPlayers();
            query.where.PlayerId = players.map(player => player.id);
        }

        const results = await Result.findAll(query);
        const resultPlayers = [...new Set(results.map(result => result.PlayerId))];
        const resultCompetitionPlayer = await this.playerService.getResultPlayer();
        const resultCompetition = results.filter(r => r.PlayerId === resultCompetitionPlayer?.id);

        const participants = await Promise.all(resultPlayers
            .map(async (rp) => {
                const player = await this.playerService.getPlayer(rp);

                if (!player) return null;

                const playerResults = results.filter(r => r.PlayerId === rp);

                const resultDAO = returnResults ? await Promise.all(playerResults.map(async (pr) => {
                    const team = await this.teamService.getTeamById(pr.TeamId);
                    return { position: pr.position, team: team?.name }
                })) : [];

                return {
                    userId: player.UserId,
                    playerName: player.name,
                    score: this.calculateScore(playerResults, resultCompetition),
                    results: resultDAO
                }
            }));

        return participants.sort((a, b) => b?.score - a?.score);
    }

    calculateScore(playerResults: Result[], resultCompetition: Result[]) {
        return playerResults.reduce((acc: any, cur: Result) => {
            const teamResult = resultCompetition.find(rc => rc.TeamId === cur.TeamId);

            if (!teamResult) throw new Error('Result and player teams are diferent');

            acc += Math.abs(cur.position - teamResult.position);
            return acc;
        }, 0)
    }

    async create(competitionId: number, standings: Standings[], { ignoreUser, userId, playerName }: PlayerParam) {
        let player: Player | null;
        if (!ignoreUser) {
            player = await this.playerService.getUserPlayer(userId, playerName);
        } else {
            player = await this.playerService.getPlayerByName(playerName);
        }

        if (!player) throw new Error('Failed to create player');

        return Promise.all(standings.map(async (standing) => {
            const teamObject = await this.teamService.getTeam(standing.team);
            return Result.create({
                CompetitionId: competitionId,
                PlayerId: player?.id,
                TeamId: teamObject.id,
                position: standing.position
            });
        }));
    }

    async update(competitionId: number, standings: Standings[], userId: number) {
        const player = await this.playerService.getUserPlayer(userId, 'error');

        return Promise.all(standings.map(async (standing) => {
            const teamObject = await this.teamService.getTeam(standing.team);
            const results = await Result.findOne(
                {
                    where: {
                        CompetitionId: competitionId,
                        PlayerId: player?.id,
                        TeamId: teamObject.id
                    }

                });
            if (results)
                return Result.update({ position: standing.position },
                    {
                        where: {
                            CompetitionId: competitionId,
                            PlayerId: player?.id,
                            TeamId: teamObject.id
                        }
                    })

            return Result.create({
                CompetitionId: competitionId,
                PlayerId: player?.id,
                TeamId: teamObject.id,
                position: standing.position
            });
        }));
    }
}

export default ResultService;