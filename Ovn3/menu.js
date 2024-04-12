var menuState = {

    create: function() {
        game.add.image(0, 0, 'background');

        var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');

        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text, 
            { font: '25px Arial', fill: '#ffffff', align: 'center'});
            scoreLabel.anchor.setTo(0.5, 0.5); 

        var startLabel = game.add.text(game.world.centerX, game.world.height-80, 
            'press the up arrow key to start', { font: '25px Arial', fill: '#ffffff' });

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

        upKey.onDown.addOnce(this.start, this);

        var tween = game.add.tween(nameLabel);
        
        tween.to({y: 80}, 1000);
        tween.start();

        game.add.tween(nameLabel).to({y: 80}, 1000).start();
        game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();


        game.add.tween(nameLabel.scale).to({x: 1, y: 1}, 300).start();

        //game.add.tween(this.plyer.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();

        if (!localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', 0);
        }

        if (game.global.score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', game.global.score);
        }
            
    },

    start: function() {
        game.state.start('main');
    },
};