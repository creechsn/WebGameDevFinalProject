// This contains all the game items/functions to be used
var mainState = {
        preload: function() {

        // all the images/spunds that will be used in the game
        game.load.image('player', 'assets/player1.png'); 

        game.load.image('Obstacle', 'assets/block.png');

        game.load.image('background', 'assets/background.png');

        game.load.audio('jump', 'assets/jump.wav');
    },

    /* ------------------------------------------------------------------------------------------------
    -- Create: This function initializes sprites and obstacles onto the screen
     ---------------------------------------------------------------------------------------------- */

    create: function() { 
        // Set the background of the game to blue and add sound effects
        game.stage.background = background;

        this.jumpSound = game.add.audio('jump'); 



        // Use Phaser physics
        game.physics.startSystem(Phaser.Physics.ARCADE);


        // Set player settings
        this.player = game.add.sprite(100, 245, 'player');

        game.physics.arcade.enable(this.player);

        this.player.body.gravity.y = 1000;  

        this.player.anchor.setTo(-0.2, 0.5); 




        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);  

        // Add obstacles
        this.Obstacles = game.add.group();    

        this.timer = game.time.events.loop(1500, this.addRowOfObstacles, this);



        // Add score to screen
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
            { font: "35px Geneva", fill: "#ffffff" });   

        this.score += 1;
        this.labelScore.text = this.score;

    },


    /* ------------------------------------------------------------------------------------------------
    -- Update: This function updates as player moves through game
     ---------------------------------------------------------------------------------------------- */
    update: function() {

        if (this.player.y < 0 || this.player.y > 490)
            this.restartGame();

        game.physics.arcade.overlap(
        this.player, this.Obstacles, this.hitObstacle, null, this);  

        if (this.player.angle < 20)
        this.player.angle += 1; 
    },

    /* ------------------------------------------------------------------------------------------------
    -- Jump: Animates and adds sound effects to player on jump
     ---------------------------------------------------------------------------------------------- */
    jump: function() {
        
        this.player.body.velocity.y = -350;

        this.jumpSound.play(); 

        var animation = game.add.tween(this.player);

        animation.to({angle: -20}, 100);

        animation.start(); 

        if (this.player.alive == false)
        return;  
    },

    /* ------------------------------------------------------------------------------------------------
    -- Restart: restarts the game
     ---------------------------------------------------------------------------------------------- */
    restartGame: function() {
        
        game.state.start('main');
    },

    /* ------------------------------------------------------------------------------------------------
    -- addOneObstacle: adds one obstacle to map and delete when it is out of range
     ---------------------------------------------------------------------------------------------- */
    addOneObstacle: function(x, y) {

        var Obstacle = game.add.sprite(x, y, 'Obstacle');

        this.Obstacles.add(Obstacle);

        game.physics.arcade.enable(Obstacle);

        Obstacle.body.velocity.x = -200; 

        Obstacle.checkWorldBounds = true;
        Obstacle.outOfBoundsKill = true;
    },

    /* ------------------------------------------------------------------------------------------------
    -- addRowOfObstacles: Randomly determines a number of blocks in an obstacle + generates them
     ---------------------------------------------------------------------------------------------- */
    addRowOfObstacles: function() {

        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOneObstacle(400, i * 60 + 10);   
    },

    /* ------------------------------------------------------------------------------------------------
    -- addMovingObstacles: Add obstacles that move across the screen 
     ---------------------------------------------------------------------------------------------- */
     addMovingObstacles: function(){

        if (game.physics.arcade.distanceBetween(enemy, player) < 200) {

            this.timer = game.time.events.loop(2000, this.addOneObstacle, this);


        }

     }


    /* ------------------------------------------------------------------------------------------------
    -- hitObstacle: recognizes when player hits an obstacle and kills them
     ---------------------------------------------------------------------------------------------- */
    hitObstacle: function() {

        if (this.player.alive == false)
            return;

        this.player.alive = false;

        game.time.events.remove(this.timer);

        this.Obstacles.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 

};


/* ------------------------------------------------------------------------------------------------
-- This chunk of code calls the game to be initialized at a certain size + start
 ---------------------------------------------------------------------------------------------- */
var game = new Phaser.Game(400, 490);

game.state.add('main', mainState); 

game.state.start('main');