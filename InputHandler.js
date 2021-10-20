export default class InputHandler {
  constructor(player) {
    document.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
          player.moveLeftBuffer();
          break;
        case 39:
          player.moveRightBuffer();
          break;
      }
    });
    document.addEventListener('keyup', (event) => {
      switch (event.keyCode) {
        case 37:
          if (player.speed < 0) {
            player.stop();
          }
          break;
        case 39:
          if (player.speed > 0) {
            player.stop();
          }
          break;
      }
    });
  }
}
