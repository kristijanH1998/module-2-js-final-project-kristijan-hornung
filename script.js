const scoreEl = document.querySelector('#scoreEl');
const levelEl = document.querySelector('#levelEl');
const livesEl = document.querySelector('#livesEl');
const soundEl = document.querySelector('#soundEl');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 800;
let backgroundColor = 'black';
let soundOn = true;

//buttons
const menuBtn = document.getElementById('menuBtn');
const menuUI = document.getElementById('menuUI');
const newGameBtn = document.getElementById('newGameBtn');
const optionsBtn = document.getElementById('optionsBtn');
const backgroundBtn = document.getElementById('backgroundBtn');
const soundBtn = document.getElementById('soundBtn');
const spaceshipBtn = document.getElementById('spaceshipBtn');
const highScoresBtn = document.getElementById('highScoresBtn');
const quitBtn = document.getElementById('quitBtn');
const backBtnMain = document.getElementById('backBtnMain');
const backBtnOptions = document.getElementById('backBtnOptions');
const blackBtn = document.getElementById('blackBtn');
const indigoBtn = document.getElementById('indigoBtn');
const blueBtn = document.getElementById('blueBtn');
const greyBtn = document.getElementById('greyBtn');
const greenBtn = document.getElementById('greenBtn');
const design1Btn = document.getElementById('design1Btn');
const design2Btn = document.getElementById('design2Btn');
const design3Btn = document.getElementById('design3Btn');
const gameOverHeading = document.getElementById('gameOver');
const gameWonHeading = document.getElementById('gameWon');

const colorBtns = [blackBtn, indigoBtn, blueBtn, greyBtn, greenBtn];

let asteroidDestroyed = new Audio('invaderkilled.wav');
let invaderShoot = new Audio('fastinvader1.wav');
let invaderKilled = new Audio('invaderkilled.wav');
let boss1Shoot = new Audio('ufo_highpitch.wav');
let boss2Shoot = new Audio('ufo_highpitch.wav');
let bossDamaged = new Audio('invaderkilled.wav');
let bossDestroyed = new Audio('explosion.wav');
let playerKilled = new Audio('explosion.wav');
let laserShot = new Audio('shoot.wav');
const sounds = [asteroidDestroyed, invaderShoot, invaderKilled, boss1Shoot, boss2Shoot, bossDamaged, bossDestroyed,
    playerKilled, laserShot];
let spaceshipDesign = 'spaceship1.png';
const spaceshipDesignBtns = [design1Btn, design2Btn, design3Btn];

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };
        this.rotation = 0;
        this.opacity = 1;
        const image = new Image();
        image.src = './' + spaceshipDesign;
        image.onload = () => {
            const scale = 0.06;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        }
    }
    draw(){
        c.save();
        c.globalAlpha = this.opacity;
        c.translate(player.position.x + player.width / 2, 
                    player.position.y + player.height / 2);
        c.rotate(this.rotation);
        c.translate(-player.position.x - player.width / 2, 
                    -player.position.y - player.height / 2);
        if(this.image){
            c.drawImage(this.image, 
                        this.position.x, 
                        this.position.y, 
                        this.width, 
                        this.height);
        }
        c.restore();
    }
    update() {
        if(this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
    changeDesign() {
        let newDesign = new Image();
        newDesign.src = './' + spaceshipDesign;
        newDesign.onload = () => {
            const scale = 0.06;
            this.image = newDesign;
            this.width = newDesign.width * scale;
            this.height = newDesign.height * scale;
        }
    }
}

class Invader {
    constructor({position, imageSrc, color}) {
        this.velocity = {
            x: 0,
            y: 0
        };
        this.color = color;
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            this.image = image;
            this.width = 31;
            this.height = 39;
            this.position = {
                x: position.x,
                y: position.y
            };
        }
    }
    draw(){
        if(this.image){
            c.drawImage(this.image, 
                        this.position.x, 
                        this.position.y, 
                        this.width, 
                        this.height);
        }
    }
    update({velocity}) {
        if(this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    
    }
    shoot(InvaderProjectiles){
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }));
    }
}

class Grid {
    constructor({velocity}){
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
        this.invaders = [];
        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);
        this.width = columns * 30; //30 is the width of each Invader
        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({position: {
                    x: x * 32,
                    y: y * 32 
                 }, imageSrc: enemyImages[level - 1], color: colors[level - 1]}));
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 4;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Particle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.fades) {
            this.opacity -= 0.01;
        }
    }
}

class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }
    draw() {
        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y,
        this.width, this.height);
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class BossProjectile {
    constructor({position, velocity, width, height, color}) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y,
        this.width, this.height);
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class BossLaser extends BossProjectile{
    constructor({position, velocity, width, height, color}) {
        super({position, velocity, width, height, color});
    }
    update({velocity}){
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
    }
}

class Asteroid {
    constructor({position, imageSrc, scale, speed}) {
        //this.position = position;
        this.velocity = {
            x: 0,
            y: speed
        };
        const image = new Image();
        image.src = imageSrc;
        this.scale = scale;
        image.onload = () => {
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            };
        }
    }
    draw(){
        if(this.image){
            c.drawImage(this.image, 
                        this.position.x, 
                        this.position.y, 
                        this.width, 
                        this.height);
        }
    }
    update() {
        if(this.image) {
            this.draw();
            this.position.y += this.velocity.y;
        }
    }
}

class Planet extends Asteroid{
    constructor({position, imageFile, scale, velocity}){
        super({position});
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        };
        const image = new Image();
        image.src = imageFile;
        image.onload = () => {
            this.scale = scale;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            };
        }
    }

    draw(){
        c.save();
        c.globalAlpha = 1;
        if(this.image){
            c.drawImage(this.image, 
                        this.position.x, 
                        this.position.y, 
                        this.width, 
                        this.height);
        }
        c.restore();
    }
    update(){
        if(this.image) {
            this.draw();
            this.position.y += this.velocity.y;
        }
    }
}

class Boss {
    constructor({bossPosition, imageSrc, color, width, height, endurance}) {
        this.velocity = {
            x: 2,
            y: 0
        };
        this.isDestroyed = false;
        this.color = color;
        this.shotsTaken = 0;
        this.endurance = endurance;
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            this.image = image;
            this.width = width;
            this.height = height;
            this.position = {
                x: bossPosition.x,
                y: bossPosition.y
            };
        }
        this.lasers = [];
        if(level === 12){
            this.lasers.push(new BossLaser({
                position: {
                    x: bossPosition.x + width / 2 - 10,
                    y: bossPosition.y + height
                },
                velocity: {
                    x: this.velocity.x,
                    y: 0
                },
                width: 20,
                height: 545,
                color: 'lightblue'
            }));
        }
    }
    draw(){
        if(this.image){
            c.drawImage(this.image, 
                        this.position.x, 
                        this.position.y, 
                        this.width, 
                        this.height);
        }
    }
    update() {
        if(this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
                this.velocity.x = -this.velocity.x;
            }
        }    
    }
    shoot(BossProjectiles){
        if(level === 6) {
            BossProjectiles.push(new BossProjectile({
                position: {
                    x: this.position.x + 300,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 5,
                    y: 30
                },
                width: 9,
                height: 30,
                color: 'red'
            }), new BossProjectile({
                position: {
                    x: this.position.x + this.width - 310,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: -5,
                    y: 30
                },
                width: 9,
                height: 30,
                color: 'red'
            }), new BossProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 10
                },
                width: 9,
                height: 30,
                color: 'red'
            }));
        } else {
            //delete Boss1's projectile objects from BossProjectiles, and add Boss2's
            BossProjectiles.splice(0, BossProjectiles.length);
            BossProjectiles.push(new BossProjectile({
                position: {
                    x: this.position.x + 50,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 3,
                    y: 5
                },
                width: 150,
                height: 5,
                color: 'pink'
            }), new BossProjectile({
                position: {
                    x: this.position.x + this.width - 150,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: -3,
                    y: 5
                },
                width: 150,
                height: 5,
                color: 'pink'
            }));
        }
    }
}

const player = new Player();
const projectiles = [];
const grids = [];
const InvaderProjectiles = [];
const BossProjectiles = [];
const particles = [];
const backgroundStars = [];
const asteroids = [];

const enemyImages = ['invader1.png', 'invader2.png', 'invader3.png', 'invader4.png', 'invader5.png', 'boss1.png',
'invader6.png', 'invader7.png', 'invader8.png', 'invader9.png', 'invader10.png', 'boss2.png'];
const colors = ['yellow', 'blue', 'lightgreen', 'red', 'lightblue', 'white', 'orange', 'purple', 'orange', 'pink', 'yellow', 'lightgreen'];
let score = 0;
let level = 1;
let lives = 3;
let asteroidCount = 2;
let asteroidSpeed = 1;

const bosses = [];

let planet1 = new Planet({
    position: {
        x: 100,
        y: -200
    }, 
    imageFile: './purple-planet.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet2 = new Planet({
    position: {
        x: 200,
        y: -200
    }, 
    imageFile: './saturn.png',
    scale: 0.5,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet3 = new Planet({
    position: {
        x: 300,
        y: -200
    }, 
    imageFile: './jupiter.png',
    scale: 0.15,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet4 = new Planet({
    position: {
        x: 400,
        y: -200
    }, 
    imageFile: './mars.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet5 = new Planet({
    position: {
        x: 500,
        y: -200
    }, 
    imageFile: './mercury.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet6 = new Planet({
    position: {
        x: 600,
        y: -200
    }, 
    imageFile: './venus.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet7 = new Planet({
    position: {
        x: 700,
        y: -200
    }, 
    imageFile: './earth.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet8 = new Planet({
    position: {
        x: 800,
        y: -200
    }, 
    imageFile: './neptune.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet9 = new Planet({
    position: {
        x: 900,
        y: -200
    }, 
    imageFile: './uranus.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
let planet10 = new Planet({
    position: {
        x: 1000,
        y: -200
    }, 
    imageFile: './blue-planet-1.png',
    scale: 0.2,
    velocity: {
        x: 0,
        y: 0
    }
});
const planets = [planet1, planet2, planet3, planet4, planet5, planet6, planet7, planet8, planet9, planet10];

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames1 = 0;
let frames2 = 0;
let frames3 = 0;
let frames4 = 0;


let randomInterval = Math.floor((Math.random() * 500) + 500);
let planetRespawnInterval = Math.floor((Math.random() * 750) + 100);
let asteroidRespawnInterval = Math.floor((Math.random() * 750) + 100);

//background stars
for(let i = 0; i < 100; i++){
    backgroundStars.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.3
        },
        radius: Math.random() * 2,
        color: 'white'
    }))
}

function updateAsteroids() {
    while(asteroids.length < asteroidCount){
        let randomAsteroidStartPosition = -((Math.random() * 1000) + 100);
        //console.log(randomAsteroidStartPosition)
        asteroids.push(new Asteroid({
            position: {
                x: Math.random() * canvas.width,
                y: randomAsteroidStartPosition
            },
            imageSrc: level <= 3 ? './asteroid.png' : (
                level <= 7 ? './brown-asteroid.png' : './fire-asteroid.png'),
            scale: level <= 3 ? 0.1 : (level <= 7 ? 0.06 : 0.04), 
            speed: asteroidSpeed 
        }));
    }
    //console.log(asteroids.length)
}

//explosion particles
function createParticles({object, color, fades, radius}) {
    for(let i = 0; i < 15; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: radius || Math.random() * 3,
            color: color || '#BAA0DE',
            fades: fades
        }))
    }
}

updateAsteroids();

let animationRequest;
let newGameClicked;

function animate() {
    animationRequest = requestAnimationFrame(animate);
    c.fillStyle = backgroundColor;
    c.fillRect(0, 0, canvas.width, canvas.height);
    backgroundStars.forEach((star) => {
        //background stars rendered
        if(star.position.y - star.radius >= canvas.height) {
            star.position.x = Math.random() * canvas.width;
            star.position.y = -star.radius;
        } else {
            star.update();
        }
    });

    planets.forEach((planet) => {
        if(planet.position && (planet.position.y - (planet.height / 2) >= canvas.height)) {
            planet.velocity.y = 0;
            planet.position.x = Math.random() * canvas.width;
            planet.position.y = -planet.height;
        } else {
            planet.update();
        }
    });

    if(menuUI.classList.contains('d-block') && !newGameClicked){
        cancelAnimationFrame(animationRequest);
    }

    particles.forEach((particle, i) => {
        //explosion particles
        if(particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1);
            }, 0);
        } else  {
            particle.update();
        }
    });
    
    player.update();
    asteroids.forEach((asteroid, index) => {
        projectiles.forEach((projectile, j) => {
            //asteroid destroyed
            if(projectile.position.y - projectile.radius <= asteroid.position.y + asteroid.height
                && projectile.position.x + projectile.radius >= asteroid.position.x
                && projectile.position.x - projectile.radius <= asteroid.position.x + asteroid.width
                && projectile.position.y + projectile.radius >= asteroid.position.y){
                asteroidDestroyed.play();
                setTimeout(() => {
                    const asteroidFound = asteroids.find(asteroid2 => {
                        return asteroid2 === asteroid;
                    });
                    const projectileFound = projectiles.find(projectile3 => projectile3 === projectile);
                    //remove asteroid and projectile
                    if(asteroidFound && projectileFound) {
                        score += 50;
                        scoreEl.innerHTML = score;

                        createParticles({
                            object: asteroid,
                            color: 'grey', 
                            fades: true
                        });
                        asteroids.splice(index, 1);
                        let respawnAsteroidTime = Math.floor(Math.random() * 10) + 1;
                        setTimeout(() => {
                            updateAsteroids(); //update asteroid number after one asteroid was eliminated
                        }, respawnAsteroidTime * 1000);
                        projectiles.splice(j, 1);
                    }
                }, 0);
            }
        });
        //asteroid hits player
        if(asteroid.position && player.position){
            if(asteroid.position.y + asteroid.height >= player.position.y + (player.height / 2)
            && asteroid.position.x + asteroid.width >= player.position.x
            && asteroid.position.x <= player.position.x + player.width
            && asteroid.position.y < canvas.height){
                testGameState(asteroids, index, asteroid, player);
            } else {
                if(asteroid.position.y - (asteroid.height / 2) >= canvas.height) {
                    asteroid.position.x = Math.random() * canvas.width;
                    asteroid.position.y = -((Math.random() * 1000) + 100);
                }
                asteroid.update();
            }
        }
        
    });

    InvaderProjectiles.forEach((InvaderProjectile, index) => {
        if(InvaderProjectile.position.y + InvaderProjectile.height
            >= canvas.height) {
            setTimeout(() => {
                InvaderProjectiles.splice(index, 1);
            }, 0);
        } else {
            InvaderProjectile.update();
        }
        //projectile hits player
        if(InvaderProjectile.position.y + InvaderProjectile.height >= player.position.y
            && InvaderProjectile.position.x + InvaderProjectile.width >= player.position.x
            && InvaderProjectile.position.x <= player.position.x + player.width){
                testGameState(InvaderProjectiles, index, null, player);
                
        }
    });
    //player's projectile movement update
    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });

    grids.forEach((grid, gridIndex) => {
        grid.update();
        //spawn projectiles
        let invaderFirerate = 140 - (level * 10);
        if(frames1 % invaderFirerate === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles);
            invaderShoot.play();
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            //projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if(projectile.position && invader.position){
                    if(projectile.position.y - projectile.radius <= invader.position.y + invader.height
                        && projectile.position.x + projectile.radius >= invader.position.x
                        && projectile.position.x - projectile.radius <= invader.position.x + invader.width
                        && projectile.position.y + projectile.radius >= invader.position.y){
                        
                        setTimeout(() => {
                            const invaderFound = grid.invaders.find(invader2 => {
                                return invader2 === invader;
                            });
                            const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);
                            //remove invader and projectile
                            if(invaderFound && projectileFound) {
                                invaderKilled.play();
    
                                //update score
                                score += 100;
                                scoreEl.innerHTML = score;
    
                                createParticles({
                                    object: invader,
                                    fades: true,
                                    color: invader.color
                                });
                                grid.invaders.splice(i, 1);
                                projectiles.splice(j, 1);
                                if(grid.invaders.length > 0) {
                                    const firstInvader = grid.invaders[0];
                                    const lastInvader = grid.invaders[grid.invaders.length - 1];
                                    grid.width = lastInvader.position.x - firstInvader.position.x
                                    + lastInvader.width;
                                    grid.position.x = firstInvader.position.x;
                                } else {
                                    grids.splice(gridIndex, 1);
                                }
                            }
                        }, 0);
                    }
                }
            });
        })
    });

    //enable rendering of bosses on levels 6 and 12, until they are destroyed
    if(level == 6 && (bosses.length === 0)) {
        bosses.push(new Boss({bossPosition: {
            x: 400,
            y: 50 
        }, imageSrc: enemyImages[5], color: colors[5], width: 400, height: 200, endurance: 1}));
    }
    if(level == 6 && !bosses[0].isDestroyed) {
        bosses[0].update();
        let boss1Firerate = 50;
        if(frames3 % boss1Firerate === 0) {
            bosses[0].shoot(BossProjectiles);
            boss1Shoot.play();
            frames3 = 0;
        }
    }
    if(level == 12 && (bosses.length === 0)) {
        bosses.push(new Boss({bossPosition: {
            x: 400,
            y: 50 
        }, imageSrc: enemyImages[11], color: colors[11], width: 400, height: 200, endurance: 1}));
    }
    if(level == 12 && !bosses[0].isDestroyed) {
        bosses[0].update();
        bosses[0].lasers.forEach((laser) => {
            laser.update({velocity: bosses[0].velocity});
            if(laser.position.x + laser.width >= player.position.x &&
                 laser.position.x <= player.position.x + player.width){
                    testGameState(null, null, null, player);
            }
        });
        let boss2Firerate = 120;
        if(frames3 % boss2Firerate === 0) {
            bosses[0].shoot(BossProjectiles);
            boss2Shoot.play();
            frames3 = 0;
        }
    }

    bosses.forEach((boss, bossIndex) => {
        //player shoots at the boss
        projectiles.forEach((projectile, j) => {
            if(projectile.position && boss.position){
                if(projectile.position.y - projectile.radius <= boss.position.y + boss.height
                    && projectile.position.x + projectile.radius >= boss.position.x
                    && projectile.position.x - projectile.radius <= boss.position.x + boss.width
                    && projectile.position.y + projectile.radius >= boss.position.y){
                    
                    setTimeout(() => {
                        const bossFound = bosses.find(bossShot => {
                            return bossShot === boss;
                        });
                        const projectileFound = projectiles.find(projectile4 => projectile4 === projectile);
                        //remove projectile
                        if(bossFound && projectileFound) {
                            bossDamaged.play();
                            boss.shotsTaken++;
                            //test if boss has been shot at enough times, if yes then boss is destroyed
                            if(boss.shotsTaken >= boss.endurance) {
                                createParticles({
                                    object: boss,
                                    fades: true,
                                    color: boss.color,
                                    radius: 20
                                });
                                boss.isDestroyed = true;
                                if(level === 12) {
                                    setTimeout(() => {
                                        menuUI.classList.remove('d-none');
                                        menuUI.classList.add('d-block');
                                        gameWonHeading.classList.remove('d-none');
                                        cancelAnimationFrame(animationRequest);
                                        gameOver();
                                    }, 2000);
                                }
                                level++;
                                levelEl.innerHTML = level;
                                bosses.splice(bossIndex, 1);
                                bossDestroyed.play();
                            }
                            projectiles.splice(j, 1);
                        }
                    }, 0);
                }
            }
        });
    });
    
    BossProjectiles.forEach((BossProjectile, index) => {
        if(BossProjectile.position.y + BossProjectile.height
            >= canvas.height) {
            setTimeout(() => {
                //here we can't write 'BossProjectiles.splice(index, 1);' because when fast projectiles reach the bottom of the canvas; the index of the middle slower projectile
                //changes from 1 to 0, and the middle projectile gets removed too early in the next phase of pushing new projectiles to the BossProjectiles array
                BossProjectiles.splice(BossProjectiles.indexOf(BossProjectile), 1);
            }, 0);
        } else {
            BossProjectile.update();
        }
        //projectile hits player
        if(BossProjectile.position.y + BossProjectile.height >= player.position.y
            && BossProjectile.position.x + BossProjectile.width >= player.position.x
            && BossProjectile.position.x <= player.position.x + player.width){
                testGameState(BossProjectiles, BossProjectiles.indexOf(BossProjectile), null, player)
        }
    });

    if (keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -5;
        player.rotation = -.15;
    } else if (keys.d.pressed && (player.position.x + player.width <= canvas.width)) {
        player.velocity.x = 5;
        player.rotation = .15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }
    //spawning enemies
    if(frames1 % randomInterval === 0){
        //on levels 6 and 12 no grids of invaders will spawn, but intead bosses attack the player
        if(level !== 6 && level !== 12){
            grids.push(new Grid({velocity: {x: 0.5 * level, y: 0}}));
            randomInterval = Math.floor((Math.random() * 500) + 500);
            frames1 = 0;
        } 
    }
    //spawning planets at random intervals with random positions on x-axis and random velocities
    if(frames2 % planetRespawnInterval === 0){
        let randomPlanet = planets[Math.floor(Math.random() * planets.length)];
        while(randomPlanet.velocity.y != 0){
            randomPlanet = planets[Math.floor(Math.random() * planets.length)];
        }
        randomPlanet.velocity.y = Math.floor(Math.random() * 2) + 0.5;
        planetRespawnInterval = Math.floor((Math.random() * 750) + 100);
        frames2 = 0;
    }
    //frames4 % 60 === 0 will execute the code in the if statement every 1 second (due to 60hz per second refresh rate)
    if((level < 12) && (frames4 % 60 === 0) && (frames4 !== 0) && (bosses.length === 0)) {
        level++;
        levelEl.innerHTML = level;
        asteroidCount = (level <= 3) ? 2 : ((level <= 7) ? 4 : 6);
        asteroidSpeed = (level <= 3) ? 2 : ((level <= 7) ? 3 : 4);
        frames4 = 0;
    }
    frames1++;
    frames2++;
    frames3++;
    frames4++;
}
animate();

//run each time the player is hit by enemy projectile, laser, or asteroid; if player has no more lives left, call 
//continueOrEndGame() to terminate the game
function testGameState(enemyArray, arrayIndex, enemyObject, player) {
    playerKilled.play();
    lives--;
    livesEl.innerHTML = lives;
    setTimeout(() => {
        if(enemyArray){
            enemyArray.splice(arrayIndex, 1);
        }
        player.opacity = 0;
    }, 0);
    createParticles({
        object: player,
        color: 'white',
        fades: true
    });
    if(enemyObject) {
        createParticles({
            object: enemyObject,
            color: 'grey',
            fades: true
        })
    }
    continueOrEndGame(player);
}

function continueOrEndGame(player) {
    if(lives <= 0){
        //stop game animation 2 seconds after player has been killed for the last time (no lives left)
        setTimeout(() => {
            gameOverHeading.classList.remove('d-none');
            menuUI.classList.remove('d-none');
            menuUI.classList.add('d-block');
            cancelAnimationFrame(animationRequest);
            gameOver();
        }, 2000);
    } else {
        //'respawn' the player visually on the canvas 2 seconds after it has been hit by enemies but still has lives remaining
        //the player will flicker for several seconds while being respawned
        setTimeout(() => {
            let flickerTimes = 0;
            const flickerInterval = setInterval(() => {
                if(player.opacity === 1) {
                    player.opacity = 0.5;
                } else {
                    player.opacity = 1;
                }
                flickerTimes++;
                if((flickerTimes) === 11) {
                    clearInterval(flickerInterval);
                }
            }, 300);   
        }, 2000);
        return;
    } 
}

addEventListener('keydown', ({ key }) => {
    if(lives <= 0) return;
    switch(key){
        case 'a': 
            keys.a.pressed = true;
            break;
        case 'd': 
            keys.d.pressed = true;
            break; 
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            laserShot.play();
            break;
    }
});
addEventListener('keyup', ({ key }) => {
    switch(key){
        case 'a': 
            keys.a.pressed = false;
            break;
        case 'd': 
            keys.d.pressed = false;
            break; 
        case ' ': 
            keys.space.pressed = false;
            break;
    }
});

//event listeners for buttons in Menu UI and Main Menu Button

//opens the main menu interface
menuBtn.addEventListener('click', function(){
    if(menuUI.classList.contains('d-none')){
        menuUI.classList.remove('d-none');
        menuUI.classList.add('d-block');
        setTimeout(() => {
            cancelAnimationFrame(animationRequest);
        }, 0);
        backToMenu();
    } else {
        menuUI.classList.add('d-none');
        menuUI.classList.remove('d-block');
        if(lives > 0 && newGameClicked) {
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, 0);
        }
    }  
});

//Starts a new game; initiates the animation of the game
newGameBtn.addEventListener('click', function() {
    newGameClicked = true;
    menuUI.classList.remove('d-block');
    menuUI.classList.add('d-none');
    newGameBtn.innerHTML = 'Continue';
    if(!gameOverHeading.classList.contains('d-none')){
        gameOverHeading.classList.add('d-none');
    }
    if(!gameWonHeading.classList.contains('d-none')){
        gameWonHeading.classList.add('d-none');
    }
    if(animationRequest){
        cancelAnimationFrame(animationRequest);
    }
    animate();
});

//Opens the Options menu
optionsBtn.addEventListener('click', function() {
    for (const child of menuUI.children) {
        if(child == backgroundBtn || child == soundBtn || child == spaceshipBtn || child == backBtnMain){
            child.classList.add('d-block');
            child.classList.remove('d-none');
        } else {
            child.classList.remove('d-block');
            child.classList.add('d-none');
        }  
    }
    backBtnMain.onclick = function() {
        backToMenu();
    }
});

//Navigates user back to the main menu
function backToMenu() {
    for (const child of menuUI.children) {
        if(child == newGameBtn || child == optionsBtn || child == highScoresBtn){
            child.classList.add('d-block');
            child.classList.remove('d-none');
        } else {
            child.classList.remove('d-block');
            child.classList.add('d-none');
        }  
    }
    if(newGameClicked) {
        quitBtn.classList.add('d-block');
        quitBtn.classList.remove('d-none');  
    }
}

//navigates user back to the Options menu
function backToOptions() {
    for (const child of menuUI.children) {
        if(child == backgroundBtn || child == soundBtn || child == spaceshipBtn || child == backBtnMain){
            child.classList.add('d-block');
            child.classList.remove('d-none');
        } else {
            child.classList.remove('d-block');
            child.classList.add('d-none');
        }  
    }
}

//Enables choosing color of background
backgroundBtn.addEventListener('click', function() {
    for (const child of menuUI.children) {
        if(child == blackBtn || child == indigoBtn || child == blueBtn || child == greyBtn || child == greenBtn
            || child == backBtnOptions){
            child.classList.add('d-block');
            child.classList.remove('d-none');
        } else {
            child.classList.remove('d-block');
            child.classList.add('d-none');
        }  
    }
    backBtnOptions.onclick = function() {
        backToOptions();
    }
    colorBtns.forEach(button => {
        button.onclick = function() {
            backgroundColor = button.style.backgroundColor;
            setTimeout(() => {
                animate();            
                if(animationRequest){
                    cancelAnimationFrame(animationRequest);
                }
            }, 0);    
        }
    });
});

//setting Sound on/off 
soundBtn.addEventListener('click', function() {
    if(soundOn) {
        soundOn = false;
        sounds.forEach(sound => {
            sound.muted = true;
        });
        soundEl.innerHTML = 'Off';
    } else {
        soundOn = true;
        sounds.forEach(sound => {
            sound.muted = false;
        });
        soundEl.innerHTML = 'On';
    }
});

//open the choose spaceship design menu
spaceshipBtn.addEventListener('click', function() {
    for (const child of menuUI.children) {
        if(child == design1Btn || child == design2Btn || child == design3Btn || child == backBtnOptions){
            child.classList.add('d-block');
            child.classList.remove('d-none');
        } else {
            child.classList.remove('d-block');
            child.classList.add('d-none');
        }  
    }
    backBtnOptions.onclick = function() {
        backToOptions();
    }
});

//choose spaceship design
spaceshipDesignBtns.forEach(button => {
    button.addEventListener('click', function() {
        spaceshipDesign = button.firstChild.getAttribute('src');
        player.changeDesign();
        setTimeout(() => {
            animate();            
            if(animationRequest){
                cancelAnimationFrame(animationRequest);
            }
        }, 5);
    });
});

//Quit button removes all existing enemies, asteroids, and projectiles from the canvas, and sets level, score, and lives remaining
//to initial values before game is started. It also shows the Main Menu from before the New Game is selected. Animation frame values are also reset.
quitBtn.addEventListener('click', gameOver);

function gameOver(){
    level = 1;
    score = 0;
    lives = 3;
    levelEl.innerHTML = level;
    scoreEl.innerHTML = score;
    livesEl.innerHTML = lives;
    while(grids.length > 0){
        grids.pop();
    }
    while(asteroids.length > 0){
        asteroids.pop();
    }
    while(bosses.length > 0) {
        bosses.pop();
    }
    while(projectiles.length > 0) {
        projectiles.pop();
    }
    while(InvaderProjectiles.length > 0) {
        InvaderProjectiles.pop();
    }
    while(BossProjectiles.length > 0) {
        BossProjectiles.pop();
    }
    setTimeout(() => {
        animate();            
        if(animationRequest){
            cancelAnimationFrame(animationRequest);
        }
    }, 5);
    frames1 = 0;
    frames2 = 0;
    frames3 = 0;
    frames4 = 0;
    newGameClicked = false;
    newGameBtn.innerHTML = 'New Game';
    backToMenu();
}