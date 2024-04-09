import UserService from "../../services/user-service";
import { BadRequestError, CustomError } from '../../helpers/custom-exception';
import { Request, Response, NextFunction } from "express-serve-static-core";
import { ParsedQs } from "qs";

class Controller {
    private service: UserService;
    constructor() {
        this.service = new UserService();
    }

    async singin(req: any, res: any, next: Function) {
        const { body } = req;

        try {
            const { username, password } = body;
            if (!username) {
                throw new BadRequestError('Username is required');
            }

            if (!password) {
                throw new BadRequestError('Password is required');
            }

            const { token, userId } = await this.service.singin(username, password);
            res.status(200).send({
                userId,
                token
            });
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
            const { username, password } = req.body;
            if (!username || !password) {
                throw new BadRequestError('Username and password must be informed');
            }

            const { token, userId } = await this.service.create(username, password);

            res.status(200).send({
                userId,
                token
            });
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

    check(req: any, res: any, next: Function): Function {
       res.status(204).send();
       return next();
    }
}
export default Controller;