import { removePlayerFromAfkMapsAndSets } from "./afkdetection";
import { specPlayerIdList, playerConnStrings, redPlayerIdList, bluePlayerIdList, room, pauseUnpauseGame, restartGameWithCallback } from "./index";
import { movePlayerToTeam, moveLastOppositeTeamMemberToSpec } from "./teammanagement";

export function handlePlayerLeaving(player: PlayerObject): void {
    const playerId: number = player.id;
    let playerIdList: number[] = [];
    const playerList = room.getPlayerList();
    if (redPlayerIdList.includes(playerId) || bluePlayerIdList.includes(playerId)) {
        playerIdList = redPlayerIdList.includes(playerId) ? redPlayerIdList : bluePlayerIdList;
        if (playerList.length !== 0) handleTeamPlayerLeaving(playerIdList, playerList);
    } else {
        playerIdList = specPlayerIdList;
    }
    playerIdList.splice(playerIdList.indexOf(playerId), 1);
    removePlayerFromAfkMapsAndSets(playerId);
    playerConnStrings.delete(playerId);
    if (playerList.length === 0) room.stopGame();
    console.log(`>>> ${player.name} saiu da sala.`);
}

function handleTeamPlayerLeaving(teamPlayerIdList: number[], playerList: PlayerObject[]) {
    const oppositeTeamPlayerIdList: number[] = teamPlayerIdList === redPlayerIdList ? bluePlayerIdList : redPlayerIdList;
    if (playerList.length === 1) {
        restartGameWithCallback(() => movePlayerToTeam(playerList[0].id, redPlayerIdList));
    } else if (specPlayerIdList.length === 0) {
        restartGameWithCallback(() => moveLastOppositeTeamMemberToSpec(oppositeTeamPlayerIdList));
    } else {
        movePlayerToTeam(specPlayerIdList[0], teamPlayerIdList);
        pauseUnpauseGame();
    }
}