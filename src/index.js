import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import cors from 'cors'
import uniqid from 'uniqid';
import Game from './Game';
const app = express();
const server = http.Server(app);
const io = socketio(server);

const GameFactory = () => {
  const id = uniqid.process();
  const namespace = io.of(id);
  const game = new Game(id, namespace);

  namespace.on('connection', socket => {
    if (game.playerCount < 2){
      game.addPlayer(socket);
    }else{
      socket.emit('game-full');
      socket.disconnect();
    }
  });

  namespace.on('disconnect', () => {
    console.log(`Someone disconnected from ${id}`);
    game.stopGame();
  });

  return game;
};

app.use(cors())

app.get('/create-game', (req, res) => {
  const game = GameFactory();
  res.json({ gameID: game.id });
});

const server_port = process.env.YOUR_PORT || process.env.PORT || 7070;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, () => {
    console.log('Listening on port %d', server_port);
});
