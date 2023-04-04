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
            const { email } = body;
            if (!email) {
                throw new BadRequestError('E-mail is required');
            }

            if (!body.password) {
                throw new BadRequestError('Password is required');
            }

            const { token, userId } = await this.service.singin(body.email, body.password);
            res.header('x-auth-token', token).send({
                userId
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
            const { body } = req;
            if (!body.login || !body.password) {
                throw new BadRequestError('Login and password must be informed');
            }

            const { token, userId } = await this.service.create(body.login, body.password);

            res.header('x-auth-token', token).send({
                userId
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
}
export default Controller;