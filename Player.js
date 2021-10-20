import Animation from './Animation.js';
import {
  DIRECTIONS,
  SOUNDS,
  retrievePlayerInformation,
  PLAYER_STATE,
} from './SharedConstants.js';
import { playSound } from './PlaySound.js';

const SPRITE_SIZE = 50;
const DISPLAY_SIZE = 25;

export default class Player {
  constructor(game, colour, userName) {
    this.userName = userName;
    this.colour = colour;
    this.width = DISPLAY_SIZE;
    this.game = game;
    this.height = DISPLAY_SIZE;
    this.canMove = true;
    this.playerState = PLAYER_STATE.ALIVE;
    this.movementBuffer = [];
    this.ticker = 300;
    this.position = {
      x: this.game.gameArea.endX - this.width,
      y: this.game.gameArea.endY - this.height,
    };

    this.tilePosition = DIRECTIONS.RIGHT;

    const { animationStrip, jumpSound } = retrievePlayerInformation(
      game,
      this.height,
      this.width,
      colour
    );
    this.animationStrip = animationStrip;
    this.jumpSound = jumpSound;

    this.sprite_sheet = {
      frame_sets: [[0, 1], [2, 3, 4, 5, 6], [7]],
      image: this.animationStrip,
    };
    this.animation = new Animation(this.sprite_sheet.frame_sets[0], 30);
    this.movement = {
      activated: false,
      direction: null,
      frameToReach: 20,
      currentFrame: 0,
    };
  }

  resetMovement() {
    this.canMove = true;
    this.animation = new Animation(this.sprite_sheet.frame_sets[0], 30);
    this.movement = {
      activated: false,
      direction: null,
      frameToReach: 20,
      currentFrame: 0,
    };
  }

  callEverySecond() {}

  changeAnimationStrip(animationStrip) {
    this.animationStrip = animationStrip;
    this.sprite_sheet = {
      frame_sets: [[0, 1], [2, 3, 4, 5, 6], [7]],
      image: this.animationStrip,
    };
    this.animation = new Animation(this.sprite_sheet.frame_sets[0], 30);
  }

  movingDirection(direction) {
    this.movement.currentFrame = this.movement.currentFrame + 1;
    if (this.movement.currentFrame <= this.movement.frameToReach) {
      switch (direction) {
        case DIRECTIONS.LEFT:
          if (this.tilePosition === DIRECTIONS.LEFT) {
            this.position.y = this.position.y - this.height / 20;
          } else {
            this.position.y = this.position.y - this.height / 20;
            this.position.x = this.position.x - this.width / 20;
          }
          break;
        case DIRECTIONS.RIGHT:
          if (this.tilePosition === DIRECTIONS.RIGHT) {
            this.position.y = this.position.y - this.height / 20;
          } else {
            this.position.x = this.position.x + this.width / 20;
            this.position.y = this.position.y - this.height / 20;
          }
          break;
      }
    } else {
      if (this.playerState === PLAYER_STATE.ALIVE) {
        this.landFromMoving();
        this.resetMovement();
      }
    }
  }

  death() {
    if (this.playerState === PLAYER_STATE.ALIVE) {
      this.canMove = false;
      this.animation.change(this.sprite_sheet.frame_sets[2], 5);
      playSound(SOUNDS.DEATH);
      this.playerState = PLAYER_STATE.DEAD;
      setTimeout(() => {
        this.game.crossingGame.removePlayer(this);
      }, 5000);
    }
  }

  moveLeftBuffer() {
    this.movementBuffer.push(this.moveLeft.bind(this));
  }

  moveRightBuffer() {
    this.movementBuffer.push(this.moveRight.bind(this));
  }

  moveLeft() {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = DIRECTIONS.LEFT;
      this.movement.activated = true;
      this.canMove = false;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }

  moveRight() {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = DIRECTIONS.RIGHT;
      this.movement.activated = true;
      this.canMove = false;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }

  landFromMoving() {
    if (this.game.crossingGame) {
      const landedOnTile = this.game.crossingGame.getTileLandedOn(
        this.position
      );
      this.tilePosition = landedOnTile.rowPosition;
      landedOnTile && landedOnTile.break();
    }
  }

  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.drawImage(
      this.sprite_sheet.image,
      this.animation.frame * SPRITE_SIZE,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      this.position.x,
      this.position.y,
      DISPLAY_SIZE,
      DISPLAY_SIZE
    );
  }

  update(deltaTime) {
    if (this.movementBuffer.length !== 0 && this.canMove) {
      this.movementBuffer[0]();
      this.movementBuffer.shift();
    }
    if (this.movement.activated) {
      this.movingDirection(this.movement.direction);
    }
    this.ticker += deltaTime / 1000;
    if (this.ticker >= 1) {
      this.callEverySecond();
      this.ticker = this.ticker - 1;
    }
    this.animation.update(deltaTime);

    if (this.position.x < this.game.gameArea.startX) this.death();
    if (this.position.x + this.width > this.game.gameArea.endX) {
      this.death();
    }
    if (this.position.y < this.game.gameArea.startY) {
      this.death();
    }
    if (this.position.y + this.height > this.game.gameArea.endY) {
      this.death();
    }
  }
}
