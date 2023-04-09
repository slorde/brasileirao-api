import Competition from "../model/Competition";
import ResultService from "./result-service";


class CompetitionService {
    private resultService;
    constructor() {
        this.resultService = new ResultService();
    }

    async find(type: string | undefined, returnResults = true, filterUsers = false) {
        const competitions = await Competition.findAll();
        return Promise.all(competitions
            .filter(competition => {
                if (!type) return true;
                if (type === 'active') return !competition.endDate;
                if (type === 'unstarted') return !competition.endDate && !competition.beginDate;
                if (type === 'finished') return competition.endDate && competition.beginDate;
            }).map(async (competition) => {
                const participants = await this.resultService.resultDetail(competition.id);
                return {
                    id: competition.id,
                    year: competition.year,
                    value: competition.value,
                    started: !!competition.beginDate,
                    finished: competition.endDate && competition.beginDate,
                    participants
                }
            }));
    }

    async create(year: number, value: number) {
        const competition = await Competition.create({ year, value });
        await this.resultService.updateResults(competition.id);
    }

    async start(competitionId: number) {
        await Competition.update({ beginDate: new Date() }, { where: { id: competitionId } });
    }

    async end(competitionId: number) {
        await this.resultService.updateResults(competitionId);
        await Competition.update({ endDate: new Date() }, { where: { id: competitionId } });
    }

    async leaderBoard() {
        const competitions = await this.find('finished', false, true);

        const calculatedChampions: any = {};
        competitions.forEach(c => {
            const scoreSortedParticipants = c.participants.sort((a,b)=> a?.score-b?.score);
            const champions = [scoreSortedParticipants[0]];

            if (scoreSortedParticipants[1]?.score === scoreSortedParticipants[0]?.score) {
                champions.push(scoreSortedParticipants[1])
            }

            champions.forEach(champion => {
                const name = champion?.playerName || 'erro';
                const winsNUmber = calculatedChampions[name] || 0;
                calculatedChampions[name] = winsNUmber + 1;
            })
        });

        return Object.keys(calculatedChampions).map(key => {
            return {
                player: key,
                winNumbers: calculatedChampions[key]
            }
        })
    }
}

export default CompetitionService;