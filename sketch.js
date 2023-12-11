/**
 * This is a game where the player controls a character to avoid rocks and score points, with different
 * game states and sound effects.
 */
var girl, girlRun;
var backgroundIMG;
var ground, groundImg, invGround;
var rock, rockImage, RocksGroup, rock1, rock2, rock3, rock4;
var gameOver, reset, resetImg, gameOverImg;
var score, HIScore, displayHS;
var PLAY, END, gameState;
var jumpSound, dieSound, checkPointSound;

function preload() {
  backgroundIMG = loadImage("./assets/cave_BG.png");
  girlRun = loadImage("./assets/GirlRun.gif");

  rock1 = loadImage("./assets/rock1.jpg");
  rock2 = loadImage("./assets/rock2.jpg");
  rock3 = loadImage("./assets/rock3.png");
  rock4 = loadImage("./assets/rock4.jpg");

  resetImg = loadImage("./assets/restart.png");
  gameoverImg = loadImage("./assets/GameOver.jpg");

  //jumpSound = loadSound("./assets/");
  // dieSound = loadSound("./assets/");
  // checkPointSound = loadSound("./assets/");
}

/* `function setup()` is a function in JavaScript that is used in the p5.js library to set up the
initial environment for the sketch. It is called once at the beginning of the program and is used to
create the canvas, set up sprites, load images and sounds, and initialize variables. In this
specific code, `function setup()` is creating the canvas, setting up sprites for the girl, ground,
rocks, and reset button, loading images and sounds, initializing variables, and setting the game
state to "PLAY". */
function setup() {
  createCanvas(windowWidth, windowHeight);

  girl = createSprite(50, height - 70, 60, 60);
  girl.addAnimation("girlRun", girlRun);
  //girl.addAnimation("girlDead", girlDead);
  girl.scale = 0.3;
  girl.debug = true;
  girl.setCollider("rectangle", 0, 0, 80, 80);


  ground = createSprite(width / 2, height - 60, 600, 10);

  invGround = createSprite(50, height - 40, 200, 10);
  invGround.visible = false;

  // Ground = createSprite(width / 2, height - 70, width, 10);
  // Ground.shapeColor = "blue";

   //invGround = createSprite(50, height - 40, 200, 10);
   //invGround.visible = true;

  /* `RocksGroup = createGroup();` is creating a new group called `RocksGroup`. This group is used to
store all the rock sprites that are spawned in the game. It allows for easy management of multiple
sprites at once, such as setting their velocities or lifetimes, and checking for collisions with
other sprites. */
  RocksGroup = createGroup();

  reset = createSprite(width / 2, height / 2, 50, 50);
  reset.addImage("resetImg", resetImg);

 //create game over sprite object
  // gameover = createSprite(width / 2, height / 2 - 100, 50, 50);
  // gameover.addImage("gameoverImg", gameoverImg);



  score = 0;
  hiScore = 0;
  displayHS = false;

  PRESTART = -1;
  PLAY = 1;
  END = 0;
  gameState = PRESTART;
}

/* `function draw()` is a function in JavaScript that is used in the p5.js library to continuously
execute code and update the canvas. It is called repeatedly after `function setup()` and is used to
draw and update sprites, handle user input, and update game logic. In this specific code, `function
draw()` is handling the game state, updating the score, spawning rocks, checking for collisions, and
displaying the game over screen and reset button when the game ends. It also draws the sprites on
the canvas and updates their positions and animations. 
*/
function draw() {
  /* This code is setting the background of the canvas to an image stored in the
`backgroundIMG` variable. The `background()` function is a built-in function in
p5.js that sets the background color or image for the canvas. In this case, it is
using the `backgroundIMG` variable to set the background image. */

  //set background color
  background(backgroundIMG);

  if (gameState == PRESTART) {
    text("Welcome to Cave Valkyrie");

     text("click the mouse to start the game");

    //add a text to press on a certain button so that the user can start playing
         if(mousePressedOver)
    //add a condition to check if that button has been clicked and change gamestate to play
   
   if (gameState == PLAY) {
    //setting visibility of reset icons
    reset.visible = false;
    gameover.visible = false;

    //make the checkpoint sound when the player crosses
      if (score % 200 == 0) {
      checkPointSound.play();
      }

    if (displayHS == true) {
      //text styling
      stroke("black");
      strokeWeight(5);
      fill("red");
      textSize(20);

      text("hi score: " + hiScore, width - 200, 23);
    }

    if (keyDown("space") || keyDown(UP_ARROW) || touches.length == 1) {
      girl.velocityY = -5;
      //  jumpSound.play();
    }

    girl.velocityY = girl.velocityY + 0.4;

    //ground behaviour
    // ground.velocityX = -(7 + score / 70);
    //  if (ground.x < 0) {
    //    ground.x = ground.width / 2;
    //  }

    score = Math.round(score + getFrameRate() / 60);

    spawnRocks();

    if (girl.isTouching(RocksGroup)) {
      gameState = END;
    
    }
  } else if (gameState == END) {
    background(rgb(145, 37, 29));
    reset.visible = true;
    gameover.visible = true;

    girl.velocityY = 0;
    //girl.changeAnimation("girlDead");

    //ground.velocityX = 0;

    RocksGroup.setVelocityXEach(0);
    RocksGroup.setLifetimeEach(-1);

    if (score > hiScore) {
      hiScore = score;
    }
    //text styling
    stroke("black");
    strokeWeight(5);
    fill("red");
    textSize(20);

    text("hi score: " + hiScore, width - 200, 23);

    if (mousePressedOver(reset)) {
      gameState = PLAY;

      RocksGroup.destroyEach();

      girl.changeAnimation("girlRun");

      score = 0;

      displayHS = true;
    }
  }

  //text styling
  stroke("black");
  strokeWeight(5);
  fill("white");
  textSize(20);

  text("Score: " + score, width - 350, 24);

  girl.collide(invGround);

  drawSprites();
}
}

/**
 * The function spawns rocks with different images and velocities at regular intervals.
 */
function spawnRocks() {
  if (frameCount % 70 == 0) {
    rock = createSprite(width, height - 85, 10, 10);
    rock.velocityX = -(7 + score / 70);
    rock.debug = true;

    /* `var caseNumber = Math.round(random(1, 6));` is generating a random integer between 1 and 6
(inclusive) and storing it in the variable `caseNumber`. This variable is then used in a `switch`
statement to determine which image to add to the rock sprite. The `switch` statement checks the
value of `caseNumber` and executes the corresponding `case` block. */
    var caseNumber = Math.round(random(1, 6));

    //if the case name matches with the name given in swtich statement, then execute it
    /* The `switch` statement is a control flow statement in JavaScript that allows the code to execute
    different actions based on different conditions. In this specific code, the `switch` statement is
    checking the value of the variable `caseNumber` and executing the corresponding `case` block. */
    switch (caseNumber) {
      case 1:
        rock.addImage("rock1", rock1);
        rock.scale = 0.9;
        /* `break;` is a keyword used in the `switch` statement in JavaScript to exit the switch block.
       When a `case` statement is executed, the code inside that case is executed until a `break`
       statement is encountered. The `break` statement exits the switch block and continues
       executing the code after the switch block. In the given code, `break;` is used to exit each
       `case` block after the corresponding image is added to the rock sprite. */
        break;

      case 2:
        rock.addImage("rock2", rock2);
        rock.scale = 0.9;
        break;

      case 3:
        rock.addImage("rock3", rock3);
        rock.scale = 0.9;
        break;

      case 4:
        rock.addImage("rock4", rock4);
        rock.scale = 0.7;
        break;

      default:
        rock.addImage("rock4", rock4);
        rock.scale = 0.7;
        break;
    }

    rock.lifetime = -1 * (width / rock.velocityX) + 50;
    RocksGroup.add(rock);
  }
}
