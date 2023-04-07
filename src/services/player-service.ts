import { Op } from "sequelize";
import Player from "../model/Player";

class PlayerService {
    async getResultPlayer() {
        return this.getPlayerByName('RESULTADO');
    }

    async getUserPlayers() {
        return Player.findAll({ where: { UserId: { [Op.ne]: null } } });
    }

    async getUserPlayer(id: number, name: string) {
        const player = await Player.findOne({ where: { UserId: id } });

        if (!player) {
            return Player.create({ name, UserId: id })
        }

        return player;
    }

    async getPlayer(id: number) {
        return Player.findOne({ where: { id } })
    }

    async getPlayerByName(name: string) {
        const player = await Player.findOne({ where: { name } });
        if (!player)
            return Player.create({ name });

        return player;
    }
}

export default PlayerService;