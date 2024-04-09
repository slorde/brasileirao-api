import Competition from "../model/firestore/Competition";
import ResultService from "./result-service";


class CompetitionService {
    private resultService;
    private competitionModel;
    constructor() {
        this.resultService = new ResultService();
        this.competitionModel = new Competition()
    }

    async find(type: string | undefined, year?: string) {
        const competitions = await this.competitionModel.findAll();
        return Promise.all(competitions
            .filter(competition => {
                if (!type) return true;
                if (type === 'active') return !competition.endDate;
                if (type === 'started') return !!competition.beginDate;
                if (type === 'unstarted') return !competition.endDate && !competition.beginDate;
                if (type === 'finished') return competition.endDate && competition.beginDate;
                if (type === 'finishedYears') return competition.endDate && competition.beginDate;
            }).filter(c => { return year ? String(c.year) === year : true })
            .map(async (competition) => {
                if (type === 'finishedYears') {
                    return {
                        id: competition.id,
                        year: competition.year,
                        value: competition.value,
                        started: !!competition.beginDate,
                        finished: (!!competition.endDate && !!competition.beginDate),
                        winner: competition.winner,
                        secondWinner: competition.secondWinner
                    }
                }

                const participants = await this.resultService.resultDetail(competition.id);
                return {
                    id: competition.id,
                    year: competition.year,
                    value: competition.value,
                    started: !!competition.beginDate,
                    finished: (!!competition.endDate && !!competition.beginDate),
                    participants
                }
            }));
    }

    async findUser(id: string, userId: string) {
        return this.resultService.getResultsTeams(id, userId);
    }

    async create(year: number, value: number) {
        const competition = await this.competitionModel.create({ year, value });
        await this.resultService.updateResults(competition.id);
    }

    async updateResults() {
        const competitions = await this.find('active');
        for (const competition of competitions)
            await this.resultService.updateResults(competition.id);
    }

    async start(competitionId: string) {
        await this.competitionModel.updateById({ beginDate: new Date() }, competitionId);
    }

    async end(competitionId: string) {
        await this.resultService.updateResults(competitionId);

        const competition = await this.competitionModel.findById(competitionId);
        const competitions = await this.find(undefined, String(competition?.year));

        if (!competitions.length) throw new Error('Competition doest exist');

        const competitionData = competitions[0];
        const compParticipants = competitionData.participants || [];
        const userParticipants = compParticipants
            .filter(p => p?.playerName !== 'RESULTADO' && !!p?.userId);

        const scoreSortedParticipants = userParticipants
            .sort((a, b) => a?.score - b?.score);
        const winner = scoreSortedParticipants[0]?.playerName;

        let secondWinner = '';
        if (scoreSortedParticipants[1]?.score === scoreSortedParticipants[0]?.score) {
            secondWinner = scoreSortedParticipants[1]?.playerName;
        }

        //await this.competitionModel.update({ endDate: new Date(), winner, secondWinner }, { where: { id: competitionId } });
        await this.competitionModel.updateById({ endDate: new Date(), winner, secondWinner }, competitionId);
    }

    async leaderBoard() {
        const competitions = await this.find('finishedYears');

        const calculatedChampions: any = {
            maca: 0,
            gugu: 0,
            farofa: 0,
            xico: 0
        };
        for (const competition of competitions) {
            const winnerName = competition.winner;
            if (winnerName) {
                const winsNumber = calculatedChampions[winnerName] || 0;
                calculatedChampions[winnerName] = winsNumber + 1;
            }
            const secondWinnerName = competition.secondWinner;
            if (secondWinnerName) {
                const winsNumber = calculatedChampions[secondWinnerName] || 0;
                calculatedChampions[secondWinnerName] = winsNumber + 1;
            }
        }

        return Object.keys(calculatedChampions).map(key => {
            return {
                player: key,
                winNumbers: calculatedChampions[key]
            }
        })
    }

    async leaderBoardFullSlow() {
        const competitions = await this.find('finished', undefined);

        const calculatedChampions: any = {};
        competitions.forEach(async (c) => {
            const compParticipants = c.participants || [];
            const userParticipants = compParticipants
                .filter(p => p?.playerName !== 'RESULTADO' && !!p?.userId);

            userParticipants.forEach(up => {
                const name = up?.playerName || 'erro';
                if (!calculatedChampions[name])
                    calculatedChampions[name] = 0;
            })

            const scoreSortedParticipants = userParticipants
                .sort((a, b) => a?.score - b?.score);
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