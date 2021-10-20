import TwitchApi from './TwitchApi.js';
import { playSound } from './PlaySound.js';
import { restart } from './index.js';
import { GAMESTATE, COLOUR, SOUNDS } from './SharedConstants.js';
import { DEBUG } from './Debug.js';
import CrossingGame from './CrossingGame.js';

export default class Game {
  constructor(gameWidth, gameHeight, ctx, gameArea) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameArea = gameArea;
    this.ctx = ctx;

    this.crossingGame = null;
    this.gameObjects = [];
    this.victoryScreen;

    this.currentGameState = null;
  }

  start() {
    if (DEBUG) {
      //   startDebugGame(this);
      this.currentGameState = GAMESTATE.PLAYING;
    } else {
      this.currentGameState = GAMESTATE.PLAYING;
    }
  }

  update(deltaTime) {
    switch (this.currentGameState) {
      case GAMESTATE.PAUSED:
        break;
      case GAMESTATE.PLAYING:
        if (this.crossingGame === null) {
          this.crossingGame = new CrossingGame(this);
          this.gameObjects.push(this.crossingGame);
        }
        this.gameObjects.forEach((object) => object.update(deltaTime));
        break;
      case GAMESTATE.VICTORY:
        this.gameObjects = [this.victoryScreen];
    }
  }

  draw(ctx) {
    this.gameObjects.forEach((object) => object.draw(ctx));
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
      var winnerUserName;
      var foundPlayer = this.activePlayers.find(
        (element) => element.teamColour === player.colour
      );
      if (foundPlayer) {
        winnerUserName = foundPlayer.user;
      } else {
        winnerUserName = null;
      }
      this.victoryScreen = new VictoryScreen(
        this,
        player.colour,
        winnerUserName
      );
    } else {
      this.victoryScreen = new VictoryScreen(this, 'no', winnerUserName);
    }
    this.currentGameState = GAMESTATE.VICTORY;
    playSound(SOUNDS.VICTORY);
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }
}
