export const GAMESTATE = {
  PAUSED: 0,
  PLAYING: 1,
  VICTORY: 2,
  JOINING: 3,
};

export const PLAYER_STATE = {
  ALIVE: 0,
  DEAD: 1,
};

export const COLOUR = {
  RED: 'RED',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  ORANGE: 'ORANGE',
  TEAL: 'TEAL',
  PURPLE: 'PURPLE',
  PINK: 'PINK',
};

export const DIRECTIONS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

export const SOUNDS = {
  VICTORY: document.getElementById('victorySound'),
  JUMP: document.getElementById('jumpSound'),
  DEATH: document.getElementById('deathSound'),
  PUSH: document.getElementById('pushSound'),
  BLIP: document.getElementById('blipSound'),
  BLOOP: document.getElementById('bloopSound'),
};

export const retrievePlayerInformation = (game, width, height, colour) => {
  const playerInfo = {
    [COLOUR.RED]: {
      animationStrip: document.getElementById('redAnimationStrip'),
      jumpSound: document.getElementById('redJumpSound'),
    },
    [COLOUR.BLUE]: {
      animationStrip: document.getElementById('blueAnimationStrip'),
      jumpSound: document.getElementById('blueJumpSound'),
    },
    [COLOUR.GREEN]: {
      animationStrip: document.getElementById('greenAnimationStrip'),
      jumpSound: document.getElementById('greenJumpSound'),
    },
    [COLOUR.YELLOW]: {
      animationStrip: document.getElementById('yellowAnimationStrip'),
      jumpSound: document.getElementById('yellowJumpSound'),
    },
    [COLOUR.ORANGE]: {
      animationStrip: document.getElementById('orangeAnimationStrip'),
      jumpSound: document.getElementById('redJumpSound'),
    },
    [COLOUR.TEAL]: {
      animationStrip: document.getElementById('tealAnimationStrip'),
      jumpSound: document.getElementById('blueJumpSound'),
    },
    [COLOUR.PURPLE]: {
      animationStrip: document.getElementById('purpleAnimationStrip'),
      jumpSound: document.getElementById('greenJumpSound'),
    },
    [COLOUR.PINK]: {
      animationStrip: document.getElementById('pinkAnimationStrip'),
      jumpSound: document.getElementById('yellowJumpSound'),
    },
  };

  return playerInfo[colour];
};
