import bcrypt from 'bcrypt';
import hash from 'object-hash';
import User from '../model/user-model';
import { AuthenticationFailure, BadRequestError } from '../helpers/custom-exception';
class UserService {
    private model;
    constructor() {
        this.model = new User();
    }

    async singin(login: string, password: string) {
        const user = await this.model.findByLogin(login);
        if (!user) {
            throw new BadRequestError("User don't exist");
        }

        const isValidate = await bcrypt.compare(password, user.password);

        if (!isValidate) {
            throw new AuthenticationFailure('Wrong email or password.');
        }

        const token = '';//user.generateAuthToken(); gerar jwt
        return { token, userId: user.id };
    }

    async create(login: string, password: string) {
        let user = await this.model.findByLogin(login);
        if (user) {
            throw new BadRequestError('User already registered.');
        }

        const id = hash({ login });
        const encryptedPassword = await bcrypt.hash(password, 10);
        await this.model.insertUser(id, login, encryptedPassword);
        
        const token = '';//user.generateAuthToken();
        return { token, userId: id };
    }
}

export default UserService;