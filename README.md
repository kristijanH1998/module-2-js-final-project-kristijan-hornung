# Space Invaders Video Game
Final JavaScript project for BVT Module 2 (Intro to JavaScript)

## Table of Contents
1. [Description] (#description)
2. [How to run the project] (#how-to-run-the-project)

<a name="description"></a>
## 1. Description
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

<a name="how-to-run-the-project"></a>
## 2. How to run the project 
