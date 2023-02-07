import { removePlayerFromAfkMapsAndSets } from "./afkdetection";
import { specPlayerIdList, playerConnStrings, redPlayerIdList, bluePlayerIdList, room, pauseUnpauseGame } from "./index";
import { addPlayerToTeam, moveLastOppositeTeamMemberToSpec, restartGameWithCallback } from "./teammanagement";

export function handlePlayerLeaving(player: PlayerObject): void {
    const playerId: number = player.id;
    let playerIdList: number[] = [];
    if (redPlayerIdList.includes(playerId) || bluePlayerIdList.includes(playerId)) {
        playerIdList = redPlayerIdList.includes(playerId) ? redPlayerIdList : bluePlayerIdList;
        handleTeamPlayerLeaving(playerIdList);
    } else {
        playerIdList = specPlayerIdList;
    }
    playerIdList.splice(playerIdList.indexOf(playerId), 1);
    removePlayerFromAfkMapsAndSets(playerId);
    playerConnStrings.delete(playerId);
    console.log(`>>> ${player.name} saiu da sala.`);
}

function handleTeamPlayerLeaving(teamPlayerIdList: number[]) {
    const oppositeTeamPlayerIdList: number[] = teamPlayerIdList === redPlayerIdList ? bluePlayerIdList : redPlayerIdList;
    if (specPlayerIdList.length === 0) {
        restartGameWithCallback(() => moveLastOppositeTeamMemberToSpec(oppositeTeamPlayerIdList));
    } else {
        addPlayerToTeam(specPlayerIdList[0], teamPlayerIdList);
        pauseUnpauseGame();
    }
}