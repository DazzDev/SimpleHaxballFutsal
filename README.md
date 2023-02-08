<h1 align="center">SimpleHaxballFutsal</h1>

<h4 align="center">Simple 1x1/2x2/3x3 futsal script for <a href="https://github.com/haxball/haxball-issues/wiki/Headless-Host">Haxball Headless Host</a> (and for deploying with <a href="https://github.com/mertushka/haxball.js">haxball.js</a>).</h4>

---

### Features

- Starts and stops the match automatically, pausing and unpausing the game to give players time to prepare
- Moves players automatically depending on the number of users in the room
  - Winning players are always moved to the red team
- Includes a practice stadium mode for when a player is waiting for an opponent
- Includes automatic moderation tools:
  - Kicks players when they become AFK
  - Bans players when their message/name contains "bad" words (listed in the [`badwords.txt`](https://github.com/DazzDev/SimpleHaxballFutsal/blob/master/badwords.txt) file)
  - Kicks players when they spam
  - Kicks players when they join from a network whose IP is already connected
  - Gives admin permissions to players whose public ID is listed in the [`adminlist.txt`](https://github.com/DazzDev/SimpleHaxballFutsal/blob/master/adminlist.txt) file

---

### Demo

This room is currently (hopefully still) deployed. You can check it out by searching for [its name](https://github.com/DazzDev/SimpleHaxballFutsal/blob/6577bc8a90f36b9c1f54f57c7bd6e07ce94e44b1/index.ts#L31) in the 🇵🇹 (portuguese) section of the Haxball room list.
