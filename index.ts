import HaxballJS from "haxball.js";
import * as fs from "fs";
import { handlePlayerActivity, checkAndHandleInactivePlayers } from "./afkdetection";
import { handlePlayerJoining } from "./playerjoining";
import { handlePlayerLeaving } from "./playerleaving";
import { handleTeamWin } from "./teammanagement";
import { checkAndHandleBadWords, checkAndHandleSpam } from "./moderation";
import { checkAndHandleCommands } from "./commands";

export const debuggingMode = false;
const scoreLimit: number = 3;
const timeLimit: number = 3;

export const playerConnStrings = new Map<number, string>();
export const adminAuthList: Set<string> = new Set(fs.readFileSync("lists/adminlist.txt", "utf8").split("\n").map((line: string) => line.trim()));
export const badWordList: Set<string> = new Set(fs.readFileSync("lists/badwords.txt", "utf8").split("\n").map((line: string) => line.trim()));
export const practiceStadium: string = fs.readFileSync("stadiums/practice.hbs", "utf8");
export const stadium2x2: string = fs.readFileSync("stadiums/futsal2x2.hbs", "utf8");
export const stadium3x3: string = fs.readFileSync("stadiums/futsal3x3.hbs", "utf8");

export let specPlayerIdList: number[] = [];
export let redPlayerIdList: number[] = [];
export let bluePlayerIdList: number[] = [];

export let room: RoomObject;

HaxballJS.then((HBInit) => {
  room = HBInit({
    roomName: "⚖️ FUTSAL 24/7 JUSTO (10 DE PING) ⚖️",
    maxPlayers: 12,
    public: !debuggingMode,
    noPlayer: true,
    geo: {
      code: "PT",
      lat: 41.15144214309606,
      lon: -8.613879659626768
    },
    token: "thr1.AAAAAGPlnBh6ZXIRrl9HZg.upsN-_IEufM", //https://haxball.com/headlesstoken
  });

  room.setScoreLimit(scoreLimit);
  room.setTimeLimit(timeLimit);
  room.setTeamsLock(true);
  room.setCustomStadium(practiceStadium);

  room.onRoomLink = function (url: string) {
    console.log(url);
  };

  room.onPlayerJoin = function (player: PlayerObject): void {
    handlePlayerJoining(player);
  }

  room.onPlayerLeave = function (player: PlayerObject): void {
    handlePlayerLeaving(player);
  }

  room.onTeamGoal = function (teamId: number) {
    const scores = room.getScores();
    const teamScore = teamId === 1 ? scores.red : scores.blue;
    const teamPlayerIdList = teamId === 1 ? redPlayerIdList : bluePlayerIdList;
    if (teamScore === scoreLimit || scores.time > timeLimit * 60) restartGameWithCallback(() => handleTeamWin(teamPlayerIdList));
  }

  //triggers *only* when a team is winning and the timer runs out, 
  //because the room is also listening for the onTeamGoal event, which triggers first
  room.onTeamVictory = function (scores: ScoresObject): void {
    const teamPlayerIdList = scores.red > scores.blue ? redPlayerIdList : bluePlayerIdList;
    restartGameWithCallback(() => handleTeamWin(teamPlayerIdList));
  }

  room.onPlayerActivity = function (player: PlayerObject): void {
    handlePlayerActivity(player.id);
  }

  room.onGameTick = function (): void {
    if (!debuggingMode) checkAndHandleInactivePlayers();
  }

  room.onPlayerChat = function (player: PlayerObject, message: string): boolean {
    console.log(`${player.name}: ${message}`);
    return !checkAndHandleCommands(player, message) && !checkAndHandleBadWords(player, message) && !checkAndHandleSpam(player, message);
  }
});

export function restartGameWithCallback(callback: () => void): void {
  room.stopGame();
  callback();
  setAppropriateStadium();
  room.startGame();
  const playerList: PlayerObject[] = room.getPlayerList();
  if (playerList.length !== 1) pauseUnpauseGame();
}

function setAppropriateStadium() {
  const playerList = room.getPlayerList();
  const playerListLength = playerList.length;
  if (playerListLength === 1) {
    room.setCustomStadium(practiceStadium);
  } else if (playerListLength >= 6) {
    room.setCustomStadium(stadium3x3);
  } else {
    room.setCustomStadium(stadium2x2);
  }
}

export function pauseUnpauseGame() {
  room.pauseGame(true);
  room.pauseGame(false);
}