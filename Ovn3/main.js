var mainState = {

    preload: function() {
        game.load.image('player', 'assets/images/Spy monkey.png');
        game.load.image('wallV', 'assets/images/Line_1.png');
        game.load.image('wallH', 'assets/images/Line_2.png');
        game.load.image('coin', 'assets/images/Coin.png');
        game.load.image('enemy', 'assets/images/Enemy.png');
    },

    create: function() {
        game.stage.backgroundColer = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
        this.score = 0;

        this.createWorld();
        this.nextEnemy = 0;

        //this.jumpSound = game.add.audio('jump');
        //this.coinSound = game.add.audio('coin');
        //this.deadSound = game.add.audio('dead');

        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;

        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
       // game.add.emitter(x, y, this.maxParticles);
       /*
        if (!this.player.inWorld) {
            this.playerDie();
        }
*/
        //this.jumpSound.play();
        //this.coinSound.play();
        //this.deadSound.play();

        this.movePlayer();

        if (this.nextEnemy < game.time.now) {
            var start = 4000, end = 1000, score = 100;

            var delay = Math.max(start - (start-end)*game.global.score/score, end);

            this.addEnemy();

            this.nextEnemy = game.time.now + delay;
        }

        this.enemies.forEachAlive(this.checkPosition, this);
    },

    movePlayer: function() {

       if (this.cursor.left.isDown || this.wasd.left.isDown) {
        this.player.body.velocity.x = -200;
       } 

       else if (this.cursor.right.isDown || this.wasd.right.isDown) {
        this.player.body.velocity.x = 200;
       }  else {
       // this.player.body.velocity.x = 1;
       }

       if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
        this.player.body.velocity.y = -320;
       }
    },

    takeCoin: function(player, coin) {
        this.score += 5;
        this.scoreLabel.text = 'score: ' + this.score;

        this.updateCoinPosition();
    },

    updateCoinPosition: function() {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60},
            {x: 60, y: 140}, {x: 440, y: 140},
            {x: 130, y: 300}, {x: 370, y: 300}
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x === this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)];
        this.coin.reset(newPosition.x, newPosition.y);
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();
        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = Phaser.Utils.randomChoice(-100, 100);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls);
        game.add.sprite(480, 0, 'wallV', 0, this.walls);
        game.add.sprite(0, 0, 'wallH', 0, this.walls);
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls);
        game.add.sprite(300, 320, 'wallH', 0, this.walls);
        game.add.sprite(-100, 160, 'wallH', 0, this.walls);
        game.add.sprite(400, 160, 'wallH', 0, this.walls);

        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },

    playerDie: function() {
        game.state.start('main');

        if(!this.player.alive) {
            return;
        }

        this.player.kill();

        start(explode, lifespand, frequency, quantity);

        //this.deadSound.play();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.state(true, 600, null, 15);

        game.time.events.add(1000, this.startMenu, this);
    },

    startMenu: function() {
        game.state.start('menu');
    },

    checkPosition: function(enemy) {
        if (enemy.y > this.player.y) {
            enemy.kill();
        }
    },
};  

//var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

game.state.add('main', mainState);
game.state.start('main');


