import { Op } from "sequelize";
import Player from "../model/Player";

class PlayerService {
    async getResultPlayer() {
        let player = await Player.findOne({ where: { name: 'RESULTADO' }});
        if (!player) {
            player = Player.build({ name: 'RESULTADO'});
            await player.save();
        }

        return player;
    }

    async getUserPlayers() {
        return Player.findAll({ where: { UserId: { [Op.ne]: null }}});
    }

    async getPlayer(id: number) {
        return Player.findOne({ where: { id }})
    }
}

export default PlayerService;