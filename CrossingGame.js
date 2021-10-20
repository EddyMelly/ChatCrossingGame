import { GlassTile } from './GlassTile.js';
import { COLOUR, SOUNDS } from './SharedConstants.js';
import { playSound } from './PlaySound.js';
import { generateRandomInteger } from './GameUtils.js';
import Player from './Player.js';
import InputHandler from './InputHandler.js';

const LEVEL_STATE = {
  PAUSED: 0,
  RUNNING: 1,
};

export default class CrossingGame {
  constructor(game) {
    this.game = game;
    this.levelState = LEVEL_STATE.PAUSED;
    this.glassTiles = [];
    this.animationTimer = 0;
    this.timer = 0;
    this.backGroundImage = document.getElementById('lavaBackground');
    this.startMessage = '';
    this.level = this.generateLevel();
    this.buildLevel(this.game);
    this.players = [];
    this.spawnPlayer();
  }

  buildLevel(game) {
    this.level.forEach((row, rowIndex) => {
      let tempArray = [];
      row.forEach((tile, tileIndex) => {
        let position = {
          x: this.game.gameArea.startX + 25 * tileIndex,
          y: this.game.gameArea.startY + 25 * rowIndex,
        };
        let tempGlassTile = {
          XIndex: tileIndex,
          YIndex: rowIndex,
          tile: new GlassTile(game, position, tile),
        };
        this.glassTiles.push(tempGlassTile);
        tempArray.push(tempGlassTile);
      });
    });
  }

  generateLevel() {
    let generatedLevel = [[2, 2]];

    for (let index = 0; index < 22; index++) {
      let row = this.generateRow();
      generatedLevel.push(row);
    }
    generatedLevel.push([0, 0]);
    return generatedLevel;
  }

  generateRow() {
    let row = generateRandomInteger(0, 1);
    if (row === 1) {
      return [1, 0];
    }
    return [0, 1];
  }

  getTileLandedOn(position) {
    const { tile } = this.glassTiles.find(
      (tile) =>
        tile.tile.position.x === position.x &&
        tile.tile.position.y === position.y
    );
    return tile;
  }

  callEverySecond() {
    this.timer = this.timer + 1;
    // switch (this.levelState) {
    //   case LEVEL_STATE.RUNNING:
    //   // if (this.timer % this.breakTimer === 0 && this.glassTiles.length >= 1) {
    //   //   this.chooseTilesToBreak();
    //   // }
    //   // break;
    //   case LEVEL_STATE.PAUSED:
    //     this.displayStart(this.timer);
    //     break;
    // }
  }

  removePlayer(playerToRemove) {
    this.players = this.players.filter((player) => playerToRemove !== player);
  }

  spawnPlayer() {
    const newPlayer = new Player(this.game, COLOUR.RED, 'Ryan');
    new InputHandler(newPlayer);
    this.players.push(newPlayer);
  }

  displayStart(timer) {
    switch (timer) {
      case 0:
        this.startMessage = '3';
        break;
      case 1:
        this.startMessage = '3';
        playSound(SOUNDS.BLIP);
        break;
      case 2:
        this.startMessage = '2';
        playSound(SOUNDS.BLIP);
        break;
      case 3:
        this.startMessage = '1';
        playSound(SOUNDS.BLIP);
        break;
      case 4:
        this.startMessage = 'GO!';
        playSound(SOUNDS.BLOOP);
        break;
      case 5:
        this.startMessage = '';
        this.timer = 0;
        this.levelState = LEVEL_STATE.RUNNING;
        break;
    }
  }

  update(deltaTime) {
    switch (this.levelState) {
      case LEVEL_STATE.PAUSED:
        break;
      case LEVEL_STATE.RUNNING:
        break;
    }
    //FOR RANDOM TILE BREAKS
    // this.glassTilesNotBreaking = this.glassTiles.filter(
    //   (object) => !object.tile.breaking
    // );

    // this.glassTilesBreaking = this.glassTiles.filter(
    //   (object) => object.tile.breaking
    // );

    //TEST CODE FOR JUMPING MECHANIC
    this.glassTiles.forEach((object) => object.tile.update(deltaTime));
    this.players.forEach((player) => player.update(deltaTime));
    //TEST CODE FOR JUMPING MECHANIC

    // this.glassTilesBreaking.forEach((object) => object.update(deltaTime));

    this.animationTimer += deltaTime / 1000;
    if (this.animationTimer >= 1) {
      this.callEverySecond();
      this.animationTimer = 0;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.backGroundImage, 475, 50, 250, 600);
    if (this.levelState === LEVEL_STATE.PAUSED) {
      ctx.font = '40px luckiest_guyregular';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      ctx.fillText(this.startMessage, 600, 45);
      this.glassTiles.forEach((object) => object.tile.draw(ctx));
    }
    this.players.forEach((player) => player.draw(ctx));
  }
}
