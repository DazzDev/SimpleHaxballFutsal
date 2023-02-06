import { room, specPlayerIdList, debuggingMode, playerConnStrings, adminAuthList } from "./index";
import { moveOneSpecToEachTeam, restartGameWithCallback } from "./teammanagement";

export function handlePlayerJoining(player: PlayerObject): void {
    const playerId: number = player.id;
    const playerList: PlayerObject[] = room.getPlayerList();
    if (isPlayerAlreadyConnected(playerId, player.conn)) return;
    if (adminAuthList.has(player.auth)) room.setPlayerAdmin(playerId, true);
    room.sendAnnouncement(`👋 Bem-vindo, ${player.name}. Escreve !help para veres a lista dos comandos.`, player.id, 0x00D100, "bold", 0);
    specPlayerIdList.push(playerId);
    checkAndRestartWithNewMode(playerList.length);
}

function checkAndRestartWithNewMode(playerListLength: number): void {
    if (playerListLength <= 6 && specPlayerIdList.length === 2) restartGameWithCallback(() => moveOneSpecToEachTeam());
}

function isPlayerAlreadyConnected(playerId: number, conn: string): boolean {
    if (!debuggingMode && [...playerConnStrings.values()].some(value => value === conn)) {
        room.kickPlayer(playerId, "Já estás conectado à sala", false);
        return true;
    }
    playerConnStrings.set(playerId, conn);
    return false;
}