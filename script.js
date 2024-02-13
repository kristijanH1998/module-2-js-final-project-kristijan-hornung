const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };
        this.rotation = 0;
        const image = new Image();
        image.src = './spaceship.png';
        image.onload = () => {
            const scale = 0.15;
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
        this.radius = 3;
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

const player = new Player();
const projectiles = [];
const grids = [];
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
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });

    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});
            projectiles.forEach((projectile, j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height
                    && projectile.position.x + projectile.radius >= invader.position.x
                    && projectile.position.x - projectile.radius <= invader.position.x
                    && projectile.position.y + projectile.radius >= invader.position.y){
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 => {
                            return invader2 === invader;
                        });
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);
                        if(invaderFound && projectileFound) {
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);
                        }
                    }, 0);
                }
            });
        })
    })

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

    frames++;
}
animate();

addEventListener('keydown', ({ key }) => {
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
            //console.log(projectiles); //for checking the 'projectiles' array's contents
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