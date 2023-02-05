import { badWordsList, room } from "./index";

export function checkAndHandleBadWords(playerId: number, message: string): boolean {
    if (containsBadWords(message)) {
        room.kickPlayer(playerId, "Racismo/Homofobia/Xenofobia", true);
        return false;
    }
    return true;
}

function containsBadWords(message: string): boolean {
    return Array.from(badWordsList).some(word => message.toLowerCase().includes(word));
}