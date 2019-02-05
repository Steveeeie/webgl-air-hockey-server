import { Vec2, Edge, World, Circle } from 'planck-js';
import tableMap from './TableMap.json';

class TableSimulation {
  constructor(io, player1, player2) {
    this.goalSensor1 = null;
    this.goalSensor2 = null;
    this.io = io;
    this.paddle1 = null;
    this.paddle2 = null;
    this.player1 = player1;
    this.player2 = player2;
    this.puck = null;
    this.table = null;
    this.timer = null;
    this.world = null;
  }

  loadTable() {
    //Body Definintions

    const paddleBodyDef = {
      angularDamping: 2,
      bullet: false,
      linearDamping: 2,
      position: Vec2(0, 16),
      type: 'dynamic'
    };

    const puckBodyDef = {
      angularDamping: 0.02,
      bullet: true,
      linearDamping: 0.01,
      position: Vec2(0, 0),
      type: 'dynamic'
    };

    //Fixture Definintions

    const goalSensorFixDef = {
      filterMaskBits: 0x0004,
      isSensor: true
    };

    const paddleFixDef = {
      density: 0.5,
      filterCategoryBits: 0x0002,
      restitution: 0
    };

    const paddleBlockerFixDef = {
      filterMaskBits: 0x0002
    };

    const puckFixDef = {
      density: 0.75,
      filterCategoryBits: 0x0004,
      restitution: 0.9
    };

    //Table

    this.table = this.world.createBody();

    tableMap.map(edge => {
      this.table.createFixture(
        Edge(Vec2(edge[0].x, edge[0].y), Vec2(edge[1].x, edge[1].y))
      );
    });

    this.table.createFixture(
      Edge(Vec2(-4, 21), Vec2(4, 21)),
      paddleBlockerFixDef
    );

    this.table.createFixture(
      Edge(Vec2(-4, -21), Vec2(4, -21)),
      paddleBlockerFixDef
    );

    this.table.createFixture(
      Edge(Vec2(-12, 0), Vec2(12, 0)),
      paddleBlockerFixDef
    );

    this.goalSensor1 = this.table.createFixture(
      Edge(Vec2(-4, 22.5), Vec2(4, 22.5)),
      goalSensorFixDef
    );

    this.goalSensor2 = this.table.createFixture(
      Edge(Vec2(-4, -22.5), Vec2(4, -22.5)),
      goalSensorFixDef
    );

    //Puck
    this.puck = this.world.createBody(puckBodyDef);
    this.puck.createFixture(Circle(1), puckFixDef);

    //Paddles
    this.paddle1 = this.world.createBody(paddleBodyDef);
    this.paddle1.setPosition(Vec2(0, 16));
    this.paddle1.createFixture(Circle(1.5), paddleFixDef);

    this.paddle2 = this.world.createBody(paddleBodyDef);
    this.paddle2.setPosition(Vec2(0, -16));
    this.paddle2.createFixture(Circle(1.5), paddleFixDef);
  }

  listenForGoal() {
    this.world.on('begin-contact', contact => {
      let fixtureA = contact.getFixtureA();

      if (fixtureA === this.goalSensor1 || fixtureA === this.goalSensor2) {
        if (fixtureA === this.goalSensor1) {
          this.io.emit('player2scored');
          this.player2.score++;
        }

        if (fixtureA === this.goalSensor2) {
          this.io.emit('player1scored');
          this.player1.score++;
        }

        this.io.emit('score-updated', {
          player1: this.player1.score,
          player2: this.player2.score
        });

        this.resetSimulation();
      }
    });
  }

  updateSimulation() {
    const force = 4;

    let paddle1Vector = Vec2(
      this.player1.movement.x * force,
      this.player1.movement.y * force
    );

    let paddle2Vector = Vec2(
      -this.player2.movement.x * force,
      -this.player2.movement.y * force
    );

    this.paddle1.applyForce(
      paddle1Vector,
      Vec2(this.paddle1.getPosition()),
      true
    );

    this.paddle2.applyForce(
      paddle2Vector,
      Vec2(this.paddle2.getPosition()),
      true
    );

    this.io.emit('simulation-updated', {
      puck: this.puck.c_position.c,
      paddle1: this.paddle1.c_position.c,
      paddle2: this.paddle2.c_position.c
    });
  }

  startSimulation() {
    this.world = World();
    this.loadTable();
    this.listenForGoal();
    this.timer = setInterval(() => {
      this.world.step(1.0 / 60.0, 10, 0);
      this.updateSimulation();
    }, 0);
  }

  resetSimulation() {
    clearInterval(this.timer);
    this.startSimulation();
  }

  stopSimulation() {
    clearInterval(this.timer);
  }
}

export default TableSimulation;
