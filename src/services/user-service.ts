import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationFailure, BadRequestError } from '../helpers/custom-exception';
import User from '../model/firestore/User';


class UserService {
    private userModel;
    constructor() {
        this.userModel = new User();
    }


    async singin(username: string, password: string) {
        const user = await this.userModel.findByUserName(username);
        if (!user) {
            throw new BadRequestError("User don't exist");
        }

        const isValidate = await bcrypt.compare(password, user.password);

        if (!isValidate) {
            throw new AuthenticationFailure('Wrong email or password.');
        }

        const token = this.generateAuthToken(user.id);
        return { token, userId: user.id };
    }

    async create(username: string, password: string) {
        let user = await this.userModel.findByUserName(username);
        if (user) {
            throw new BadRequestError('User already registered.');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const usuario = await this.userModel.create({ username, password: encryptedPassword, createdAt: new Date() });        
        return this.singin(username, password);
    }

    generateAuthToken(id: string) {
        const token = jwt.sign({ _id: id }, process.env.PRIVATE_KEY || '');
        return token;
    };

    async upsert(username: string, password: string) {
        const user = await this.userModel.findByUserName(username);
        if (user)
        return user;
        
        const encryptedPassword = await bcrypt.hash(password, 10);
        return this.userModel.create({
            username: username,
            password: encryptedPassword
        });
    }
}

export default UserService;