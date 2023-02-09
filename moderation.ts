import { isCommand } from "./commands";
import { badWordList, room } from "./index";

const playerConsecutiveMessages = new Map<number, string[]>();
const playerMessageTimestamps = new Map<number, number[]>();
const rateLimit = 5;
const rateLimitTimeSpan = 4000;

export function checkAndHandleSpam(player: PlayerObject, message: string): boolean {
    const playerId: number = player.id;
    if (!isCommand(message) && (isPlayerAboveRateLimit(playerId) || is3rdConsecutiveMessage(playerId, message))) {
        room.kickPlayer(playerId, "Spam", false);
        console.warn(`>>> ${player.name} foi expulso. Razão: spam.`);
        return true;
    }
    return false;
}

function isPlayerAboveRateLimit(playerId: number): boolean {
    const currentTimestamp = Date.now();
    let messageTimestamps = playerMessageTimestamps.get(playerId) || [];
    while (messageTimestamps.length > 0 && currentTimestamp - messageTimestamps[0] > rateLimitTimeSpan) messageTimestamps.shift();
    if (messageTimestamps.length >= rateLimit) return true;
    messageTimestamps.push(currentTimestamp);
    playerMessageTimestamps.set(playerId, messageTimestamps);
    return false;
}

function is3rdConsecutiveMessage(playerId: number, message: string): boolean {
    const messages = playerConsecutiveMessages.get(playerId) || [];
    const lastMessage = messages[messages.length - 1];
    if (lastMessage === message) {
        messages.push(message);
        playerConsecutiveMessages.set(playerId, messages);
        if (messages.length === 3) return true;
    } else {
        playerConsecutiveMessages.delete(playerId);
        playerConsecutiveMessages.set(playerId, [message]);
    }
    return false;
}

export function checkAndHandleBadWords(player: PlayerObject, string: string): boolean {
    if (containsBadWords(string)) {
        room.kickPlayer(player.id, "Nome/Comentários insultuosos", true);
        console.warn(`>>> ${player.name} foi banido. Razão: nome/comentários insultuosos. (${string})`);
        return true;
    }
    return false;
}

function containsBadWords(message: string): boolean {
    return Array.from(badWordList).some((word: string) => message.toLowerCase().includes(word));
}