import Player from './Player';
import TableSimulation from './TableSimulation';

class Game {
  constructor(id, io) {
    this.id = id;
    this.io = io;
    this.player1 = null;
    this.player2 = null;
    this.playerCount = 0;
    this.table = null;
  }

  addPlayer(socket) {
    if (!this.player1) {
      this.player1 = new Player(socket, () => this.playerReady());
      this.player1.socket.emit('player-number-assigned', 1);
    } else {
      this.player2 = new Player(socket, () => this.playerReady());
      this.player2.socket.emit('player-number-assigned', 2);
      this.io.emit('status-updated', 'ready');
    }

    this.playerCount++;
  }

  playerReady() {
    if (this.player1.ready === true && this.player2.ready === true) {
      this.io.emit('status-updated', 'start');
      this.startGame();
    }
  }

  startGame() {
    this.table = new TableSimulation(this.io, this.player1, this.player2);
    this.table.startSimulation();
  }

  stopGame() {
    this.table.stopSimulation();
  }
}

export default Game;
