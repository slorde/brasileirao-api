import fetch from 'cross-fetch';
import Result from "../model/firestore/Result";
import PlayerService from "./player-service";
import TeamService from "./team-service";
import UserService from './user-service';
import Competition from '../model/firestore/Competition';
import * as cheerio from 'cheerio';
import axios from 'axios'

type ApiFutebol = {
    posicao: number,
    nome: string
}

type Standings = {
    position: number,
    team: string
}

type PlayerParam = {
    userId: string,
    playerName: string,
    ignoreUser: boolean
}

class ResultService {
    private playerService;
    private teamService;
    private userService;
    private resultModel;
    private competitionModel;
    constructor() {
        this.playerService = new PlayerService();
        this.teamService = new TeamService();
        this.userService = new UserService();
        this.resultModel = new Result();
        this.competitionModel = new Competition();
    }

    async getCrawledResult() {
        try {
            const pageHTML = await axios.get("https://ge.globo.com/futebol/brasileirao-serie-a/")
            const $ = cheerio.load(pageHTML.data)

            let saida = null;
            $('#scriptReact')?.each((i, item): void => {
                console.log(i);
                const classificacao = $(item.children).text();
                if (!classificacao) return;
                const textClassificacao = classificacao.substring(classificacao.indexOf('const classificacao = '), classificacao.length)
                const jsonClassificacao = textClassificacao.replace('const classificacao = ', '');
                saida = JSON.parse(jsonClassificacao.replace(';', '')).classificacao.map((c: any) => { return { posicao: c.ordem, nome: c.nome_popular } });
            })

            return saida;
        } catch (error) {
            console.log(error)
            return null
        }
    }



    async updateResults(competitionId: string) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.API_FUTEBOL_KEY}`
            }
        };
        const data: any = await this.getCrawledResult();
        if (!data) return;

        const player = await this.playerService.getResultPlayer();
        for (const team of data) {
            const teamName = team.nome;
            const position = team.posicao;

            const teamData = await this.teamService.getTeam(teamName);
            let resultData = await this.resultModel.findByCompetitionPlayerTeam(competitionId, player?.id, teamData.id);

            if (!resultData) {
                const newResult = {
                    position,
                    CompetitionId: competitionId,
                    PlayerId: player?.id,
                    TeamId: teamData.id
                };

                await this.resultModel.create(newResult)
            } else {
                resultData.position = position;
                await this.resultModel.updateById(resultData, resultData.id)
            }
        };
        // return Promise.all(data.map(async (team: ApiFutebol) => {
        //     const teamName = team.nome;
        //     const position = team.posicao;

        //     const teamData = await this.teamService.getTeam(teamName);
        //     let resultData = await this.resultModel.findByCompetitionPlayerTeam(competitionId, player?.id, teamData.id);

        //     if (!resultData) {
        //         const newResult = {
        //             position,
        //             CompetitionId: competitionId,
        //             PlayerId: player?.id,
        //             TeamId: teamData.id
        //         };

        //         return this.resultModel.create(newResult)
        //     }

        //     resultData.position = position;

        //     return this.resultModel.updateById(resultData, resultData.id)
        // }));
    }

    async getResultsTeams(competitionId: string, userId: string) {
        const player = await this.playerService.getUserPlayer(userId, 'error');
        const results = await this.resultModel.findByCompetitionPlayer(competitionId, player.id);

        const resultPlayer = await this.playerService.getResultPlayer();
        const resultPlayerResults = await this.resultModel.findByCompetitionPlayer(competitionId, resultPlayer.id);

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

    async resultDetail(competitionId: string, returnResults: boolean = true, filterUsers?: boolean) {
        let results = await this.resultModel.findByCompetition(competitionId);
        if (filterUsers) {
            const players = await this.playerService.getUserPlayers();
            const playerIds = players.map(player => player.id);
            results = results.filter(result => playerIds.includes(result.PlayerId));
        }

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
        let player: any;
        if (!ignoreUser) {
            player = await this.playerService.getUserPlayer(userId, playerName);
        } else {
            player = await this.playerService.getPlayerByName(playerName);
        }

        if (!player) throw new Error('Failed to create player');

        return Promise.all(standings.map(async (standing) => {
            const teamObject = await this.teamService.getTeam(standing.team);
            return this.resultModel.create({
                CompetitionId: competitionId,
                PlayerId: player?.id,
                TeamId: teamObject.id,
                position: standing.position
            });
        }));
    }

    async update(competitionId: string, standings: Standings[], userId: string) {
        const player = await this.playerService.getUserPlayer(userId, 'error');

        return Promise.all(standings.map(async (standing) => {
            const teamObject = await this.teamService.getTeam(standing.team);
            const results = await this.resultModel.findByCompetitionPlayerTeam(competitionId, player?.id, teamObject.id)

            if (results) return this.resultModel.updateById({ position: standing.position }, results.id);

            return this.resultModel.create({
                CompetitionId: competitionId,
                PlayerId: player?.id,
                TeamId: teamObject.id,
                position: standing.position
            });
        }));
    }

    async migrate(migration: any) {
        const users = migration.users;
        for (const user of users) {
            const newUser = await this.userService.upsert(user.username, user.senha);
            await this.playerService.getUserPlayer(newUser.id, user.username);
        }

        for (const resultado of migration.resultados) {
            const exists = await this.competitionModel.findByYear(resultado.ano);
            if (exists) continue;

            const competition = await this.competitionModel.create({ year: resultado.ano, value: 0, beginDate: new Date(), endDate: new Date() });
            for (const playersResults of resultado.classificacoes) {
                const p = await this.playerService.getPlayerByName(playersResults.player);
                for (const res of playersResults.results) {
                    const teamObject = await this.teamService.getTeam(res.team);
                    await this.resultModel.create({
                        CompetitionId: competition.id,
                        PlayerId: p.id,
                        TeamId: teamObject.id,
                        position: res.position
                    });
                }
            }
            this.end(competition.id);
        }
        return;
    }

    async end(competitionId: string) {
        const competition = await this.competitionModel.findById(competitionId);
        const participants = await this.resultDetail(competition.id);
        const competitionData = {
            id: competition.id,
            year: competition.year,
            value: competition.value,
            started: !!competition.beginDate,
            finished: (!!competition.endDate && !!competition.beginDate),
            participants
        }
        console.log(participants);
        
        const compParticipants = competitionData.participants || [];
        const userParticipants = compParticipants
            .filter(p => p?.playerName !== 'RESULTADO' && !!p?.userId);

        const scoreSortedParticipants = userParticipants
            .sort((a, b) => a?.score - b?.score);
        const winner = scoreSortedParticipants[0]?.playerName;
        console.log(competition.year, scoreSortedParticipants);
        
        let secondWinner = '';
        if (scoreSortedParticipants[1]?.score === scoreSortedParticipants[0]?.score) {
            secondWinner = scoreSortedParticipants[1]?.playerName;
        }
        
        await this.competitionModel.updateById({ endDate: new Date(), winner, secondWinner }, competitionId);
    }
}

export default ResultService;