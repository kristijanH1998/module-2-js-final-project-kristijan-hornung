const scoreEl = document.querySelector('#scoreEl');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 800;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };
        this.rotation = 0;
        this.opacity = 1;
        const image = new Image();
        image.src = './spaceship.png';
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
     //   c.fillStyle = 'red',
      //  c.fillRect(this.position.x, this.position.y, this.width, this.height)
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
}

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        };
        const image = new Image();
        image.src = './invader.png';
        image.onload = () => {
            const scale = 1;
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
     //   c.fillStyle = 'red',
      //  c.fillRect(this.position.x, this.position.y, this.width, this.height)
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
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = [];
        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);
        this.width = columns * 30; //30 is the width of each Invader
        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({position: {
                    x: x * 30,
                    y: y * 30 
                 }}));
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

class Asteroid {
    constructor({position}) {
        //this.position = position;
        this.velocity = {
            x: 0,
            y: Math.random() * 2.5 + 0.5
        };
        const image = new Image();
        image.src = './asteroid.png';
        image.onload = () => {
            const scale = 0.1;
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

const player = new Player();
const projectiles = [];
const grids = [];
const InvaderProjectiles = [];
const particles = [];
const backgroundStars = [];
const asteroids = [];
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

let frames = 0;
let randomInterval = Math.floor((Math.random() * 500) + 500);
let planetRespawnInterval = Math.floor((Math.random() * 750) + 100);
let game = {
    over: false,
    active: true
}

let score = 0;

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

//create asteroids
for(let i = 0; i < 3; i++){
    asteroids.push(new Asteroid({
        position: {
            x: Math.random() * canvas.width,
            y: -50
        }
    }))
}

//explosion particles
function createParticles({object, color, fades}) {
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
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            fades: fades
        }))
    }
}

function animate() {
    if(!game.active) return;
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
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
                let asteroidDestroyed = new Audio('invaderkilled.wav');
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
                            asteroids.push(new Asteroid({
                                position: {
                                    x: Math.random() * canvas.width,
                                    y: -50
                                }
                            }));
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
                let playerKilled = new Audio('explosion.wav');
                playerKilled.play();
                setTimeout(() => {
                    asteroids.splice(index, 1);
                    player.opacity = 0;
                    game.over = true;
                }, 0);
                setTimeout(() => {
                    game.active = false;
                }, 2000);
                createParticles({
                    object: player,
                    color: 'white',
                    fades: true
                });
                createParticles({
                    object: asteroid,
                    color: 'grey',
                    fades: true
                })
            } else {
                if(asteroid.position.y - (asteroid.height / 2) >= canvas.height) {
                    asteroid.position.x = Math.random() * canvas.width;
                    asteroid.position.y = -(asteroid.height / 2);
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
                let playerKilled = new Audio('explosion.wav');
                playerKilled.play();
                setTimeout(() => {
                    InvaderProjectiles.splice(index, 1);
                    player.opacity = 0;
                    game.over = true;
                }, 0);
                setTimeout(() => {
                    game.active = false;
                }, 2000);
                //console.log('you lose');
                createParticles({
                    object: player,
                    color: 'white',
                    fades: true
                });
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
        if(frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles);
            let invaderShoot = new Audio('fastinvader1.wav');
            invaderShoot.play();
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            //projectiles hit enemy
            projectiles.forEach((projectile, j) => {
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

                            let invaderKilled = new Audio('invaderkilled.wav');
                            invaderKilled.play();

                            score += 100;
                            scoreEl.innerHTML = score;
                            createParticles({
                                object: invader,
                                fades: true
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
            });
        })
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
    if(frames % randomInterval === 0){
        grids.push(new Grid());
        randomInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }
    //spawning planets at random intervals with random speeds and random velocities
    if(frames % planetRespawnInterval === 0){
        let randomPlanet = planets[Math.floor(Math.random() * 10)];
        randomPlanet.velocity.y = Math.floor(Math.random() * 2) + 0.5;
        planetRespawnInterval = Math.floor((Math.random() * 750) + 100);
    }

    frames++;
}
animate();

addEventListener('keydown', ({ key }) => {
    if(game.over) return;
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
            let laserShot = new Audio('shoot.wav');
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