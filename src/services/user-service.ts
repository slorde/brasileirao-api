import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User';
import { AuthenticationFailure, BadRequestError } from '../helpers/custom-exception';
class UserService {
    async singin(username: string, password: string) {
        const user = await User.findOne({ where: { username } });
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
        let user = await User.findOne({ where: { username } });
        if (user) {
            throw new BadRequestError('User already registered.');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const usuario = User.build({ username, password: encryptedPassword, createdAt: new Date() })
        await usuario.save();
        return this.singin(username, password);
    }

    generateAuthToken(id: number) {
        const token = jwt.sign({ _id: id }, process.env.PRIVATE_KEY || '');
        return token;
    };

    async upsert(username: string, password: string) {
        const user = await User.findOne({ where: { username } });
        if (user)
        return user;
        
        const encryptedPassword = await bcrypt.hash(password, 10);
        return User.create({
            username: username,
            password: encryptedPassword
        });
    }
}

export default UserService;