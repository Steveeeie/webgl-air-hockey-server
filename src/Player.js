class Player {
  constructor(socket, onReady) {
    this.socket = socket;
    this.score = 0;
    this.ready = false;
    this.movement = { x: 0, y: 0 };
    this.onReady = onReady;
    this.initEvents();
  }

  updateMovement(movement) {
    this.movement.x = movement.x;
    this.movement.y = movement.y;
  }

  handleReady() {
    this.ready = true;
    this.onReady();
  }

  initEvents() {
    this.socket.on('player-moved', e => this.updateMovement(e));
    this.socket.on('player-ready', () => this.handleReady());
  }
}

export default Player;
