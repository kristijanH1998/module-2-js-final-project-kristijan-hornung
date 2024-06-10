# Space Invaders Video Game
Final JavaScript project for BVT Module 2 (Intro to JavaScript)

## Table of Contents
- [Description](#description)
- [How to Run the Project](#how-to-run-the-project)
- [How to Play the Game](#how-to-play-the-game)

## Description
#### Overview and Technologies used
* 2D Space Invaders game web app built in JavaScript, HTML and CSS with Bootstrap framework. I chose JS/HTML/CSS toolkit due to the clarity and ease of creating dynamic, interactable, well-structured and styled web apps in these languages, and due to their popularity. I Used Visual Studio Code for code editing and Git for version control since I am most familiar with these tools for software editing and control
* This is a frontend application that saves game score data to web browser's local storage with its high score saving feature built using Web Storage API
* Canvas API was utilized to render 2D shapes and animations, and to achieve interaction between graphical objects in the game
* Space Invaders is a single player game, where player needs to pass all levels (stages), with different enemies at each stage which the player needs to destroy to win. If the player loses all its lives, the game is over. Score is based on the number of enemies and dangerous objects (asteroids) destroyed before the game is won. There are 2 Boss enemies throughout the gameplay, and with each new stage enemies become harder to defeat
* Incorporates 12 video game stages, main menu user interface, options for sound effects and design customization, help page, custom difficulty settings with 3 difficulty levels, and high score saving

#### Challenges faced during development
* z-index bug involving objects on the canvas, I fixed this by properly ordering the processing of object arrays in the animate() function, which is the main animation function for the game
* bugs with asteroid count increase, fixed by introducing a new variable asteroidCount to act as an upper limit to random asteroid object generation at each level increase, asteroidCount increased as level went up
* bug that prevented Boss2’s outer projectiles to reach bottom of canvas; fixed by separating the laser class from outer boss projectile classes and processing them in animate() function separately
* bug that allowed user to start the game with 0 or undefined number of lives, by selecting New Game, skipping difficulty selection by clicking on Main Menu button, and then starting a new game again; fixed by making it required for the user to select difficulty before game animation is initiated, by disabling the Continue button from appearing until difficulty has been selected
* bug that froze the application when boss2's laser shot the player, fixed by making the whole game animation stop immediately when the player loses all lives, unlike previous solution that would stop the animation 2 seconds after player loses all lives -> this required a change of timeout value in setTimeout for gameOver() function

#### Features to be implemented in the future
* Turning the game into a multiplayer online game for two players
* Some extra features such as exploding stars that when hit destroy many surrounding invaders around them, bonus items that increase player spaceship’s projectile fire rate or type of cannon the player has to shoot projectiles (maybe a laser, or rockets to fire at invaders)
* Turning the game into a full-stack application with scores and other data saved in some sort of database
* Hosting the game online (preferably on AWS)

#### Motivation
I decided to create a Space Invaders game because I always wanted to program my own game and then play it in my free time, and I always thought that video games are not easy coding projects. Thus I imagined my game to be a cool addition to my portfolio and resume.

#### Things I learned
* No project no matter how large should seem intimidating, even if you work on it alone, because with enough effort, time and resources it can be either completed fully or its progress can reach satisfactory level of completion
* Making video games like Space Invaders with various effects, animations, and potentially quite a lot of details is not as hard and complex a task as it may seem at first to end users who simply use the app without knowing its technical details
* It is important to be patient with yourself and show understanding for your own errors, progress challenges, and occasional lack of motivation or fear of failing - all these things are normal and are best overcome by simply starting to work and not thinking much about results

## How to Run the Project 
1. Download and install VS Code editor [here](https://code.visualstudio.com/download)
2. Use the terminal in VS Code (Bash, PowerShell, depending on the OS) to download and install Node.js, find instructions [here](https://nodejs.org/en/download/package-manager)
3. Use VS Code 'Extensions' page to search for and install latest version of 'HTML CSS Support' dependency (CSS Intellisense for HTML)
4. Use VS Code 'Extensions' page to search for and install latest version of 'Live Server' extension (to be able to run local development server)
5. (optional) Use VS Code 'Extensions' page to search for and install latest version of 'JavaScript (ES6) code snippets'
6. Use VS Code 'Extensions' page to search for and install latest version of 'ESLint' to integrate ESLint JavaScript into your code editor
7. Follow instructions on [this](https://github.com/git-guides/install-git) link to install Git
8. Choose the location (directory) for the project repository, navigate to it with 'cd [directory-name]' terminal command and inside of it clone the project repository by running the command 'git clone https://github.com/kristijanH1998/module-2-js-final-project-kristijan-hornung.git' in your terminal
9. Select and open 'index.html' file in the code editor, and click on 'Go Live' button at the bottom right bar in VS Code - this should open the game in your default web browser

## How to Play the Game
* When the game launches, click on New Game
![main menu with Start Game button](/readme-screenshots/space-invaders-main-menu.png?raw=true "Main Menu with New Game button")
* On the next screen, enter your username and choose the difficulty (Easy, Medium, or Hard)
![username text field and pick difficulty](/readme-screenshots/space-invaders-start-game.png?raw=true "Enter your username and choose game difficulty")
* The game now starts
* Press left arrow key to move left or right arrow key to move right
* To shoot at enemies, press Space bar. To shoot a stream of projectiles, press and hold Space bar
![player moving and shooting at enemies](/readme-screenshots/space-invaders-shooting.png?raw=true "Player moving with left/right arrow key and shooting at enemies by pressing Space key")
* Evade enemy projectiles and asteroids. Planets are not dangerous, they will not collide with the player
<p align="middle">
    <img src="/asteroidImages/asteroid.png" width="100" height="100" padding-right="20px">
    <img src="/asteroidImages/brown-asteroid.png" width="100" height="100" padding-right="20px">
    <img src="/asteroidImages/fire-asteroid.png" width="100" height="100" padding-right="20px">
</p>

* There are 12 stages in the game of increasing difficulty, with new enemies and two bosses (on levels 6 and 12). Every 1 minute, the game proceeds to a new stage. When the final boss on level 12 is destroyed, the game is won
* Depending on difficulty level chosed at the start, the player has 6, 4, or 2 lives. If player runs out of lives, the game is over
* To pause the game at any time, click on Menu bottom in top right corner. To choose spaceship design, background color, or switch sound on/off, select Options. To read instructions on how to play the game, select Help. To see high scores, click on High Scores from main Menu
* Once the game has been started, if Menu is opened, click on Continue to resume playing, or Quit to quit the game
* Current score can be found in upper left corner, alongside the current stage (level). Remaining lives and the Menu button are in the top right corner.