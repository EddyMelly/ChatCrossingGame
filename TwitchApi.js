import { DIRECTIONS, LEVEL_STATE } from './SharedConstants.js';

export default class TwitchApi {
  constructor(channel, game) {
    this.channel = channel;
    this.game = game;
    this.joinedPlayers = [];
    this.previousInstruction = {};
    this.statusElement = document.getElementById('status');
    this.twitchCall = new TwitchJs({
      log: {
        enabled: false,
      },
    });
  }
  disconnectTwitchChat() {
    const { chat } = this.twitchCall;
    chat.disconnect();
    this.statusElement.innerHTML = 'disconnected';
    this.statusElement.style.color = 'red';
  }

  connectTwitchChat() {
    const { chat } = this.twitchCall;
    chat
      .connect()
      .then(() => {
        this.game.levelState = LEVEL_STATE.JOINING;
        chat
          .join(this.channel)
          .then(() => {
            console.log('connected boy');
            this.statusElement.innerHTML = 'connected';
            this.statusElement.style.color = 'green';
          })
          .catch(function (err) {
            console.log(err);
            this.statusElement.innerHTML = 'Edgar Fucked Up';
            this.statusElement.style.color = 'red';
          });
      })
      .catch(function (err) {
        console.log(err);
        this.statusElement.innerHTML = 'Error: Cant connect right now';
        this.statusElement.style.color = 'red';
      });

    chat.on('*', (message) => {
      var clean_message = DOMPurify.sanitize(message.message, {
        ALLOWED_TAGS: ['b'],
      });
      var clean_username = DOMPurify.sanitize(message.username, {
        ALLOWED_TAGS: ['b'],
      });
      var uppercaseMessage = clean_message.toUpperCase();
      var upperCaseMessageClean = uppercaseMessage.replace(/ .*/, '');

      switch (this.game.levelState) {
        case LEVEL_STATE.SHOWING:
        case LEVEL_STATE.JOINING:
          if (
            upperCaseMessageClean === 'JOIN' ||
            upperCaseMessageClean === '!JOIN'
          ) {
            this.addUserToColour(clean_username);
          }
          break;
        case LEVEL_STATE.VICTORY:
          //VICTORY
          break;
        case LEVEL_STATE.PLAYING:
          if (
            upperCaseMessageClean === 'JOIN' ||
            upperCaseMessageClean === '!JOIN'
          ) {
            this.addUserToColour(clean_username);
          }
          if (
            upperCaseMessageClean === DIRECTIONS.LEFT ||
            upperCaseMessageClean === DIRECTIONS.RIGHT
          ) {
            this.performInstruction(clean_username, upperCaseMessageClean);
          }
          break;
      }
    });
  }

  performInstruction(userName, instruction) {
    var result = this.game.players.find(
      (player) => player.userName === userName
    );

    if (result && result.canMove) {
      this.completeInstruction(result, instruction);
    }
  }

  completeInstruction(playerTeam, instruction) {
    switch (instruction) {
      case DIRECTIONS.LEFT:
        playerTeam.moveLeftBuffer();
        break;
      case DIRECTIONS.RIGHT:
        playerTeam.moveRightBuffer();
        break;
      default:
        break;
    }
  }

  addUserToColour(cleanUserName) {
    if (!this.checkIfJoined(cleanUserName)) {
      if (
        this.game.joinedPlayers.length < 16 &&
        this.game.levelState !== LEVEL_STATE.VICTORY
      ) {
        this.game.joinedPlayers.push(cleanUserName);
        this.game.spawnPlayer(cleanUserName);
      }
    }
  }

  checkIfJoined(userName) {
    if (this.game.joinedPlayers.some((player) => player === userName)) {
      return true;
    } else {
      return false;
    }
  }
}
