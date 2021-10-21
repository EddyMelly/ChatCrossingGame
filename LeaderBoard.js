import { truncateString } from './SharedConstants.js';

export default class LeaderBoard {
  constructor(game) {
    this.game = game;
    this.leaderBoardArray = [];
    this.sortedArray = [];
  }

  addToLeaderBoard(player) {
    this.leaderBoardArray.push(player);
    this.sortedArray.push(player);
  }

  updateLeaderBoard() {
    this.sortedArray.sort(function (a, b) {
      return parseFloat(b.moves) - parseFloat(a.moves);
    });
  }

  update(deltaTime) {}

  draw(ctx) {
    ctx.font = '25px luckiest_guyregular';
    ctx.textAlign = 'center';
    let latestStartPosition = 137;

    this.sortedArray.forEach(function (element) {
      ctx.fillText(truncateString(element.userName), 910, latestStartPosition);
      ctx.fillText(element.moves, 1100, latestStartPosition);
      latestStartPosition += 33;
    });
  }
}
