import Service from "../../services/result-service";
import { BadRequestError, CustomError } from '../../helpers/custom-exception';

class Controller {
    private service: Service;
    constructor() {
        this.service = new Service();
    }

    async create(req: any, res: any, next: Function) {
        try {
            const { id: competitionId } = req.params;
            const { standings, playerName, ignoreUser, informedUser } = req.body;
            const userId = informedUser || req.user._id;

            await this.service.create(competitionId, standings, { ignoreUser, userId, playerName });
            res.status(204).send();
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Unexpected error' });
            }
        }

        return next();
    }

    async update(req: any, res: any, next: Function) {
        try {
            const { id: competitionId } = req.params;
            const { standings } = req.body;
            const userId = req.user._id;

            await this.service.update(competitionId, standings, userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }
}
export default Controller;