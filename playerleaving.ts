import { removePlayerFromAfkMapsAndSets } from "./afkdetection";
import { specPlayerIdList, playerConnStrings, redPlayerIdList, bluePlayerIdList } from "./index";
import { addPlayerToTeam, moveLastOppositeTeamMemberToSpec, restartGameWithCallback } from "./teammanagement";

export function handlePlayerLeaving(playerId: number): void {
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
}

function handleTeamPlayerLeaving(teamPlayerIdList: number[]) {
    const oppositeTeamPlayerIdList: number[] = teamPlayerIdList === redPlayerIdList ? bluePlayerIdList : redPlayerIdList;
    if (specPlayerIdList.length === 0) restartGameWithCallback(() => moveLastOppositeTeamMemberToSpec(oppositeTeamPlayerIdList));
    else addPlayerToTeam(specPlayerIdList[0], teamPlayerIdList);
}