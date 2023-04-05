import Competition from "../model/Competition";
import ResultService from "./result-service";


class CompetitionService {
    private resultService;
    constructor() {
        this.resultService = new ResultService();
    }

    async find(type: string | undefined) {
        const competitions = await Competition.findAll();
        return competitions
            .filter(competition => {
                if (!type) return true;
                if (type === 'active') return !competition.endDate;
                if (type === 'unstarted') return !competition.endDate && !competition.beginDate;
                if (type === 'finished') return competition.endDate && competition.beginDate;
            }).map((competition) => {
                return {
                    id: competition.id,
                    year: competition.year,
                    value: competition.value,
                    participants: this.resultService.resultDetail(competition.id)
                }
            });
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
        const competitions = await this.find('finished');
    }
}

export default CompetitionService;