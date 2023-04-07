import UserService from "../../services/user-service";
import { BadRequestError, CustomError } from '../../helpers/custom-exception';

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
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Unexpected error' });
            }
        }

        return next();
    }
}
export default Controller;