import Player from "../model/firestore/Player";

class PlayerService {
    private playerModel;
    constructor() {
        this.playerModel = new Player()
    }

    async getResultPlayer() {
        return this.getPlayerByName('RESULTADO');
    }

    async getUserPlayers() {
        const allPlayers =  await this.playerModel.findAll();
        return allPlayers.filter(player => !!player.UserId)
    }

    async getUserPlayer(id: string, name: string) {
        const player = await this.playerModel.findByUserId(id);

        if (!player) {
            return this.playerModel.create({ name, UserId: id })
        }

        return player;
    }

    async getPlayer(id: string) {
        return this.playerModel.findById(id);
    }

    async getPlayerByName(name: string) {
        const player = await this.playerModel.findByName(name);
        if (!player)
            return this.playerModel.create({ name });

        return player;
    }
}

export default PlayerService;