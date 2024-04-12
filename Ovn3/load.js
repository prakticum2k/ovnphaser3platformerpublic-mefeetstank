var loadState = {

    preload: function () {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        game.load.image('player', 'assets/images/Spy monkey.png');
        game.load.image('enemy', 'assets/images/Enemy.png');
        game.load.image('coin', 'assets/images/Coin.png');
        game.load.image('wallV', 'assets/images/Line_1.png');
        game.load.image('wallH', 'assets/images/Line_2.png');
        game.load.image('pixel', 'assets/images/Pixel.png');

        game.load.image('background', 'assets/images/background.png');

        //game.load.audio('jump', ['assets/.mp3']);
       // game.load.audio('coin', ['assets/.mp3']);
        //game.load.audio('dead', ['assets/.mp3']);
    },

    create: function() {
        game.state.start('menu');
    }
};