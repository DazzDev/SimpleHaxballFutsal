import HaxballJS from "haxball.js";
import * as fs from "fs";
import { handlePlayerActivity, checkAndHandleInactivePlayers } from "./afkdetection";
import { handlePlayerJoining } from "./playerjoining";
import { handlePlayerLeaving } from "./playerleaving";
import { moveNewTeam, restartGameWithCallback } from "./teammanagement";
import { checkAndHandleBadWords, checkAndHandleSpam } from "./moderation";
import { setupAnnouncements } from "./announcements";
import { checkAndHandleCommands } from "./commands";

export const debuggingMode = false;

export const playerConnStrings = new Map<number, string>();
export const adminAuthList = new Set(fs.readFileSync("adminlist.txt", "utf8").split("\n").map(line => line.trim()));
export const badWordList = new Set(fs.readFileSync("badwords.txt", "utf8").split("\n").map(line => line.trim()));
export const announcementList: string[] = fs.readFileSync("announcements.txt", "utf8").split("\n").map(line => line.trim());
export const stadium2x2: string = fs.readFileSync("futsal2x2.hbs", "utf8");
export const stadium3x3: string = fs.readFileSync("futsal3x3.hbs", "utf8");

export let specPlayerIdList: number[] = [];
export let redPlayerIdList: number[] = [];
export let bluePlayerIdList: number[] = [];

export let room: RoomObject;

HaxballJS.then((HBInit) => {
  room = HBInit({
    roomName: "⚖️ FUTSAL 24/7 JUSTO E ANTI-TÓXICO ⚖️",
    maxPlayers: 12,
    public: !debuggingMode,
    noPlayer: true,
    geo: {
      code: "PT",
      lat: 41.15144214309606,
      lon: -8.613879659626768
    },
    token: "thr1.AAAAAGPhVCae1Frpg87ZyA.ZYr7h6fD8-c", //https://haxball.com/headlesstoken
  });

  room.setScoreLimit(3);
  room.setTimeLimit(3);
  room.setTeamsLock(true);

  room.onRoomLink = function (url: string) {
    console.log(url);
    setupAnnouncements();
  };

  room.onPlayerJoin = function (player: PlayerObject): void {
    handlePlayerJoining(player);
  }

  room.onPlayerLeave = function (player: PlayerObject): void {
    handlePlayerLeaving(player.id);
  }

  room.onTeamGoal = function (teamId: number) {
    const scores = room.getScores();
    const teamScore = teamId === 1 ? scores.red : scores.blue;
    const teamPlayerIdList = teamId === 1 ? bluePlayerIdList : redPlayerIdList;
    if (teamScore === 3 || scores.time > scores.timeLimit * 60) restartGameWithCallback(specPlayerIdList.length === 0 ? () => undefined : () => moveNewTeam(teamPlayerIdList));
  }

  //triggers *only* when a team is winning and the timer runs out, 
  //because the room is also listening for the onTeamGoal event, which triggers first
  room.onTeamVictory = function (scores: ScoresObject): void {
    const teamPlayerIdList = scores.red > scores.blue ? bluePlayerIdList : redPlayerIdList;
    restartGameWithCallback(specPlayerIdList.length === 0 ? () => undefined : () => moveNewTeam(teamPlayerIdList));
  }

  room.onPlayerActivity = function (player: PlayerObject): void {
    handlePlayerActivity(player.id);
  }

  room.onGameTick = function (): void {
    if (!debuggingMode) checkAndHandleInactivePlayers();
  }

  room.onPlayerChat = function (player: PlayerObject, message: string): boolean {
    return !checkAndHandleCommands(player, message) && !checkAndHandleBadWords(player.id, message) && !checkAndHandleSpam(player.id, message);
  }
});

export function pauseUnpauseGame() {
  room.pauseGame(true);
  room.pauseGame(false);
}