import Service from "../../services/competition-service";
import { BadRequestError, CustomError } from '../../helpers/custom-exception';

class Controller {
    private service: Service;
    constructor() {
        this.service = new Service();
    }

    async find(req: any, res: any, next: Function) {
        const { query } = req;

        try {
            const { type, year } = query;
            const competitions = await this.service.find(type, year);
            res.status(200).send(competitions);
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Unexpected error' });
            }
        }

        return next();
    }

    async findUser(req: any, res: any, next: Function) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            const results = await this.service.findUser(id, userId);
            res.status(200).send(results);
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }

    async create(req: any, res: any, next: Function) {
        try {
            const { year, value } = req.body;
            if (!year || !value) {
                throw new BadRequestError('Year and value must be informed');
            }

            await this.service.create(year, value);
            console.log('1');
            
            res.status(204).send();
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Unexpected error' });
            }
        }

        return next();
    }

    async start(req: any, res: any, next: Function) {
        try {
            await this.service.start(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }

    async end(req: any, res: any, next: Function) {
        try {
            await this.service.end(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }

    async leaderBoard(req: any, res: any, next: Function) {
        try {
            const result = await this.service.leaderBoard();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }

    async updateResults(req: any, res: any, next: Function) {
        try {
            await this.service.updateResults();
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }
}
export default Controller;