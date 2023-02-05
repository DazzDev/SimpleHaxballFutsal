import { removePlayerFromAfkMapsAndSets, setLastPlayerActivityTimestamp } from "./afkdetection";
import { bluePlayerIdList, redPlayerIdList, room, specPlayerIdList, stadium2x2, stadium3x3 } from "./index";

export function addPlayerToTeam(playerId: number, teamPlayerIdList: number[]) {
    const teamId: number = teamPlayerIdList === redPlayerIdList ? 1 : 2;
    room.setPlayerTeam(playerId, teamId);
    teamPlayerIdList.push(playerId);
    specPlayerIdList.shift();
    setLastPlayerActivityTimestamp(playerId);
}

function movePlayerToSpec(playerId: number) {
    room.setPlayerTeam(playerId, 0);
    specPlayerIdList.push(playerId);
    if (redPlayerIdList.includes(playerId)) redPlayerIdList.splice(redPlayerIdList.indexOf(playerId), 1);
    if (bluePlayerIdList.includes(playerId)) bluePlayerIdList.splice(bluePlayerIdList.indexOf(playerId), 1);
    removePlayerFromAfkMapsAndSets(playerId);
}

export function moveOneSpecToEachTeam(): void {
    const teamPlayerIdLists = [redPlayerIdList, bluePlayerIdList];
    teamPlayerIdLists.forEach(teamPlayerIdList => {
        addPlayerToTeam(specPlayerIdList[0], teamPlayerIdList);
    });
}

export function moveLastOppositeTeamMemberToSpec(oppositeTeamPlayerIdList: number[]): void {
    movePlayerToSpec(oppositeTeamPlayerIdList[oppositeTeamPlayerIdList.length - 1]);
}

export function moveNewTeam(teamPlayerIdList: number[]): void {
    for (let i = 0; i < teamPlayerIdList.length; i++) {
        movePlayerToSpec(teamPlayerIdList[0]);
        addPlayerToTeam(specPlayerIdList[0], teamPlayerIdList);
    }
}

export function restartGameWithCallback(callback: () => void): void {
    room.stopGame();
    callback();
    const playerList = room.getPlayerList();
    const playerListLength = playerList.length;
    if (playerListLength >= 6) room.setCustomStadium(stadium3x3);
    else room.setCustomStadium(stadium2x2);
    if (playerListLength !== 1) room.startGame();
}