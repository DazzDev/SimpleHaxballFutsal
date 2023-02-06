import { room } from "./index";

export function checkAndHandleCommands(player: PlayerObject, message: string): boolean {
    if (!isCommand(message)) return false;
    const command = message.substring(1);
    switch (command) {
        case "help":
            room.sendAnnouncement("❓ Comandos: !help - mostrar esta mensagem; !bb - sair da sala.", player.id, 0xFFFFFF, "bold", 0);
            break;
        case "bb":
            room.kickPlayer(player.id, `Até à próxima, ${player.name}. (!bb)`, false);
            break;
        default:
            room.sendAnnouncement("🚫 Esse comando não existe.", player.id, 0xFF0000, "bold", 0);
            break;
    }
    return true;
}

export function isCommand(message: string): boolean {
    return (message !== "!" && message.startsWith("!"))
}