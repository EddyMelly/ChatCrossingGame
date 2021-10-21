import TwitchApi from './TwitchApi.js';
import { playSound } from './PlaySound.js';
import { restart } from './index.js';
import { SOUNDS, TEAM_COLOURS, LEVEL_STATE } from './SharedConstants.js';
import { DEBUG } from './Debug.js';
import CrossingGame from './CrossingGame.js';
import VictoryScreen from './VictoryScreen.js';
import LeaderBoard from './LeaderBoard.js';
import Player from './Player.js';

export default class Game {
  constructor(gameWidth, gameHeight, ctx, gameArea) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameArea = gameArea;
    this.ctx = ctx;
    this.joinedPlayers = [];
    this.crossingGame = null;
    this.gameObjects = [];
    this.victoryScreen;
    this.players = [];

    this.leaderBoard = new LeaderBoard(this);
    this.gameObjects.push(this.leaderBoard);
    this.levelState = LEVEL_STATE.CONNECTING;
  }

  spawnPlayer(cleanUserName) {
    const teamColour =
      this.players.length < TEAM_COLOURS.length
        ? TEAM_COLOURS[this.players.length]
        : TEAM_COLOURS[this.players.length - TEAM_COLOURS.length];

    if (this.levelState === LEVEL_STATE.PLAYING) {
      const newPlayer = new Player(this, teamColour, cleanUserName);
      newPlayer.canMove = true;
      this.players.push(newPlayer);
      this.leaderBoard.addToLeaderBoard(newPlayer);
    } else {
      const newPlayer = new Player(this, teamColour, cleanUserName);
      this.players.push(newPlayer);
      this.leaderBoard.addToLeaderBoard(newPlayer);
    }
  }

  removePlayer(playerToRemove) {
    this.players = this.players.filter((player) => playerToRemove !== player);
  }

  start() {
    if (DEBUG) {
      this.levelState = LEVEL_STATE.CONNECTING;
      this.TwitchApi = new TwitchApi('edgarmelons', this);
      this.TwitchApi.connectTwitchChat();
    } else {
      this.levelState = LEVEL_STATE.CONNECTING;
      this.TwitchApi = new TwitchApi('ceremor', this);
      this.TwitchApi.connectTwitchChat();
    }
  }

  update(deltaTime) {
    this.players.forEach((player) => player.update(deltaTime));
    switch (this.levelState) {
      case LEVEL_STATE.SHOWING:
      case LEVEL_STATE.JOINING:
      case LEVEL_STATE.PLAYING:
        if (this.crossingGame === null) {
          this.crossingGame = new CrossingGame(this);
          this.gameObjects.push(this.crossingGame);
        }
        this.gameObjects.forEach((object) => object.update(deltaTime));
        break;
      case LEVEL_STATE.VICTORY:
        this.gameObjects = [this.victoryScreen, this.leaderBoard];
    }
  }

  draw(ctx) {
    this.gameObjects.forEach((object) => object.draw(ctx));
    if (this.levelState !== LEVEL_STATE.VICTORY) {
      this.players.forEach((player) => player.draw(ctx));
    }
  }

  displayMessage(ctx, rgbValue, message) {
    ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
    ctx.fillStyle = rgbValue;
    ctx.fill();
    ctx.font = '35px Monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(message.main, this.gameWidth / 2, this.gameHeight / 2);
    ctx.font = '18px Monospace';
    ctx.fillText(
      message.subtitle,
      this.gameWidth / 2,
      this.gameHeight / 2 + 30
    );
  }

  victory(player) {
    if (player && player.playerState === 0) {
      this.victoryScreen = new VictoryScreen(
        this,
        player.colour,
        player.userName
      );
      playSound(SOUNDS.VICTORY);
    } else {
      this.victoryScreen = new VictoryScreen(this, 'no', '');
      playSound(SOUNDS.BLOOP);
    }
    this.levelState = LEVEL_STATE.VICTORY;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }
}
