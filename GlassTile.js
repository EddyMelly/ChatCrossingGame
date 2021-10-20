import { lavaDetection } from './CollisionDetection.js';
import { DIRECTIONS } from './SharedConstants.js';

const TILE_SIZE = 50;
const DISPLAY_SIZE = 25;

export class GlassTile {
  constructor(game, position, tileType) {
    this.game = game;
    this.image = document.getElementById('glassTile');
    this.position = { x: position.x, y: position.y };
    this.tile_sheet = {
      tile_sets: [0, 1, 2, 3],
      image: document.getElementById('glassTileSheet'),
    };

    if (tileType === 2) {
      this.breakable = false;
      this.currentTile = 1;
      this.winningTile = true;
    } else if (tileType == 1) {
      this.breakable = true;
      this.currentTile = 2;
      this.winningTile = false;
    } else {
      this.breakable = false;
      this.currentTile = 0;
      this.winningTile = false;
    }

    this.animationTimer = 0;
    this.timer = 0;
    this.rowPosition =
      this.position.x === 575 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
  }

  update(deltaTime) {
    this.animationTimer += deltaTime / 1000;
    if (this.animationTimer > 1 && this.breaking) {
      this.callEverySecond();
      this.animationTimer = 0;
    }

    if (this.currentTile === 3) {
      this.game.crossingGame.players.forEach((player) => {
        if (lavaDetection(this, player)) {
          player.death();
        }
      });
    }
  }

  showbreakable() {
    if (this.breakable) {
      this.currentTile = 3;
    }
  }

  unshowBreakable() {
    this.currentTile = 0;
  }

  callEverySecond() {
    this.timer++;
  }

  break() {
    if (this.breakable) {
      this.currentTile = 3;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.tile_sheet.image,
      this.currentTile * TILE_SIZE,
      0,
      TILE_SIZE,
      TILE_SIZE,
      this.position.x,
      this.position.y,
      DISPLAY_SIZE,
      DISPLAY_SIZE
    );
  }
}
