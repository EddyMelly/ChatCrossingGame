import { GlassTile } from './GlassTile.js';
import { SOUNDS, LEVEL_STATE } from './SharedConstants.js';
import { playSound } from './PlaySound.js';
import { generateRandomInteger } from './GameUtils.js';
import Animation from './Animation.js';

export default class CrossingGame {
  constructor(game) {
    this.game = game;
    this.glassTiles = [];
    this.animationTimer = 0;
    this.joiningTimer = 31;
    this.playTimer = 300;
    this.lastShownTile = 0;
    this.backGroundImage = document.getElementById('lavaBackground');
    this.titleMessage = 'Connecting to Twitch';
    this.level = this.generateLevel();
    this.buildLevel(this.game);
    this.sprite_sheet = {
      frame_sets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      image: document.getElementById('joinStrip'),
    };
    this.animation = this.animation = new Animation(
      this.sprite_sheet.frame_sets,
      2
    );
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

  callEveryInterval() {
    switch (this.game.levelState) {
      case LEVEL_STATE.CONNECTING:
        this.changeTitle('Connecting to Twitch');
        break;
      case LEVEL_STATE.JOINING:
        if (this.joiningTimer === 0 && this.game.players.length > 0) {
          //continue condition
          playSound(SOUNDS.BLOOP);
          this.game.levelState = LEVEL_STATE.SHOWING;
        } else if (this.joiningTimer === 0 && this.game.players.length === 0) {
          //reset timer conditions
          this.joiningTimer = 31;
        } else {
          this.joiningTimer = this.joiningTimer - 1;
          this.changeTitle('Game starting in ' + this.joiningTimer);
          if (this.game.players.length > 0 && this.joiningTimer < 3) {
            playSound(SOUNDS.BLIP);
          }
        }
        break;
      case LEVEL_STATE.SHOWING:
        if (this.titleMessage === '') {
          this.changeTitle('Pay attention!!');
        } else {
          this.changeTitle('');
        }
        this.showRowOfTiles();
        break;
      case LEVEL_STATE.PLAYING:
        this.playTimer = this.playTimer - 1;
        if (this.playTimer === 0 || this.game.players.length === 0) {
          this.game.victory();
        }
        this.changeTitle(this.playTimer);
        break;
      default:
        break;
    }
  }

  showRowOfTiles() {
    if (this.lastShownTile < this.glassTiles.length - 2) {
      this.glassTiles[this.lastShownTile].tile.unShowBreakable();
      this.glassTiles[this.lastShownTile + 1].tile.unShowBreakable();
      this.lastShownTile = this.lastShownTile + 2;
      this.glassTiles[this.lastShownTile].tile.showBreakable();
      this.glassTiles[this.lastShownTile + 1].tile.showBreakable();
    } else {
      this.game.players.forEach((player) => (player.canMove = true));
      this.game.levelState = LEVEL_STATE.PLAYING;
      this.changeTitle('GO');
      playSound(SOUNDS.BLOOP);
    }
  }

  update(deltaTime) {
    this.animation.update(deltaTime);
    this.glassTiles.forEach((object) => object.tile.update(deltaTime));
    this.animationTimer += deltaTime / 1000;

    switch (this.game.levelState) {
      case LEVEL_STATE.PLAYING:
      case LEVEL_STATE.JOINING:
        if (this.animationTimer >= 1) {
          this.animationTimer = 0;
          this.callEveryInterval(1);
        }
        break;
      case LEVEL_STATE.SHOWING:
        if (this.animationTimer >= 0.25) {
          this.animationTimer = 0;
          this.callEveryInterval(0.25);
        }
        break;
    }
  }

  changeTitle(message) {
    this.titleMessage = message;
  }

  draw(ctx) {
    ctx.drawImage(this.backGroundImage, 475, 50, 250, 600);

    ctx.font = '40px luckiest_guyregular';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    ctx.fillText(this.titleMessage, 600, 40);

    this.glassTiles.forEach((object) => object.tile.draw(ctx));

    ctx.drawImage(
      this.sprite_sheet.image,
      this.animation.frame * 150,
      0,
      150,
      150,
      145,
      85,
      150,
      150
    );
  }
}
