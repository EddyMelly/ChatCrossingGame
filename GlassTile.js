import { lavaDetection } from './CollisionDetection.js';
import { DIRECTIONS } from './SharedConstants.js';

const TILE_SIZE = 50;
const DISPLAY_SIZE = 25;

export class GlassTile {
  constructor(game, position, tileType) {
    this.game = game;
    this.breaking = false;
    this.image = document.getElementById('glassTile');
    this.position = { x: position.x, y: position.y };
    this.tile_sheet = {
      tile_sets: [0, 1, 2, 3, 4],
      image: document.getElementById('glassTileSheet'),
    };

    if (tileType === 2) {
      this.breakable = false;
      this.currentTile = 0;
      this.winningTile = true;
    } else if (tileType == 1) {
      this.breakable = true;
      this.currentTile = 1;
      this.winningTile = false;
    } else {
      this.breakable = false;
      this.currentTile = 1;
      this.winningTile = false;
    }

    this.animationTimer = 0;
    this.breakingTimer = 0;
    this.rowPosition =
      this.position.x === 575 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
  }

  update(deltaTime) {
    this.animationTimer += deltaTime / 1000;
    if (this.animationTimer > 1) {
      this.callEverySecond();
      this.animationTimer = 0;
    }

    if (this.currentTile === 4) {
      this.game.players.forEach((player) => {
        if (lavaDetection(this, player)) {
          player.death();
        }
      });
    }
  }

  showNotBreakable() {
    if (!this.breakable) {
      this.currentTile = 0;
    }
  }

  unShow() {
    if (!this.winningTile) {
      this.currentTile = 1;
    }
  }

  callEverySecond() {
    if (this.breaking && this.currentTile < 4 && !this.winningTile) {
      this.breakingTimer++;
      console.log(this.breakingTimer);
      if (this.breakingTimer % 10 === 0) {
        this.advanceBreaking();
      }
    }
  }

  break() {
    if (this.breakable) {
      this.currentTile = 4;
    }
  }

  advanceBreaking() {
    if (!this.breaking) {
      this.breaking = true;
    }
    if (this.currentTile === 0) {
      this.currentTile = 1;
    }
    if (!this.winningTile && this.currentTile < 4) {
      this.currentTile++;
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
