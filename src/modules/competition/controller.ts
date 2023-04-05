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
            const { type } = query;
            console.log(type);

            const competitions = await this.service.find(type);
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

    async create(req: any, res: any, next: Function) {
        try {
            const { year, value } = req.body;
            if (!year || !value) {
                throw new BadRequestError('Year and value must be informed');
            }

            await this.service.create(year, value);
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
            console.log(error);
            
            res.status(500).send({ message: 'Unexpected error' });
        }

        return next();
    }

    async end(req: any, res: any, next: Function) {
        try {
            await this.service.end(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.log(error);
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
}
export default Controller;