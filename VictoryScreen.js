import { COLOUR, truncateString } from './SharedConstants.js';

export default class VictoryScreen {
  constructor(game, winningTeam, winnerUserName) {
    this.winningTeam = winningTeam;
    this.trophyImage = document.getElementById('trophyImage');
    this.winnerUserName = winnerUserName;
    this.game = game;
    this.teamNamePosition = { x: 500, y: 500 };
    switch (winningTeam) {
      case COLOUR.ORANGE:
        this.winningTeamColour = '#d75f28';
        break;
      case COLOUR.TEAL:
        this.winningTeamColour = '#28d7cf';
        break;
      case COLOUR.PURPLE:
        this.winningTeamColour = '#8b28d7';
        break;
      case COLOUR.PINK:
        this.winningTeamColour = '#d728a9';
        break;
      case COLOUR.RED:
        this.winningTeamColour = '#d62839';
        break;
      case COLOUR.BLUE:
        this.winningTeamColour = '#339dd7';
        break;
      case COLOUR.GREEN:
        this.winningTeamColour = '#44cf6c';
        break;
      case COLOUR.YELLOW:
        this.winningTeamColour = '#e3c34f';
        break;
      default:
        this.winningTeamColour = 'black';
    }
  }

  update(deltaTime) {}

  draw(ctx) {
    ctx.font = '40px luckiest_guyregular';
    ctx.fillStyle = this.winningTeamColour;
    ctx.textAlign = 'center';

    ctx.fillText(`${this.winningTeam} BOY`, 605, 150);

    if (this.winnerUserName !== '') {
      ctx.font = '25px luckiest_guyregular';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(truncateString(this.winnerUserName), 605, 200);
    }

    ctx.fillText('wins', 605, 250);
    ctx.drawImage(this.trophyImage, 525, 300, 150, 200);
  }
}
