document.documentElement.style.setProperty('--bodyHeight', `${window.innerHeight}px`);

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

document.getElementById('restart').addEventListener('click', () => location.reload());



class Player {
    constructor() {
        this.width = 20;
        this.height = 110;
        this.x = 0;
        this.y = canvas.height/2 - this.height/2 ;
        this.speed = 6;
        this.up = false;
        this.down = false;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    move_events() {
        document.addEventListener('keydown', (e) => {
            if(e.keyCode == 87) this.up = true;

            if(e.keyCode == 83) this.down = true;
        })

        document.addEventListener('keyup', (e) => {
            if(e.keyCode == 87) this.up = false;

            if(e.keyCode == 83) this.down = false;
        })
    }
        

    move() {
        if(!this.up && !this.down) return false;


        if(this.up && this.y >= 0) {
            this.y -= this.speed;
        }
            
        else if(this.down && this.y + this.height <= canvas.height) {
            this.y += this.speed;
        }
            
        this.draw();
    }

    
}

let player = new Player();

player.draw();
player.move_events();


class Bot {
    constructor() {
        this.width = 20;
        this.height = 110;
        this.x = canvas.width - this.width;
        this.y = canvas.height/2 - 110/2 ;
        this.speed = 6;
        this.up = false;
        this.down = false;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    move() {
        let moveSpeed = (borderStart, borderEnd, speed) => {
            if(ball.x > borderStart && ball.x < borderEnd) {
                if(ball.y > this.y + this.height/2 && canvas.height >= this.y + this.height) {
                    this.y += speed;
                    this.down = true;
                } else this.down = false;

                if(ball.y < this.y + this.height/2 && this.y >= 0) {
                    this.y += -speed;
                    this.up = true;
                } else this.up = false;

            } else {
                this.up = false;
                this.down = false;
            }
        }

        moveSpeed(canvas.width/2, canvas.width/1.5, this.speed);
        moveSpeed(canvas.width/1.5, canvas.width, this.speed+4);

        this.draw();
    }
}

let bot = new Bot();
bot.draw();


class Ball {
    constructor() {
        this.radius = 10;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.speedX = this.radius;
        this.speedY = 1;
        this.interval = 1000/60;
        this.won = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }
    
    win(winner) {
        document.getElementById('title').innerHTML = `${winner} Won`;
        document.getElementsByClassName('end')[0].style.display = 'flex';
        this.won = true;
        return true;
    }

    collision() {
        if(this.x + this.radius >= canvas.width) {
            this.win('Player');
         
        }
        
        if(this.x - this.radius <= 0) {
            this.win('Bot');         
        }
        
        if(this.y + this.radius >= canvas.height) this.speedY *= -1; 
        
        if(this.y - this.radius <= 0) this.speedY *= -1; 


        let ballChangeY = (owner) => {
            if(owner.up && this.speedY < 0) {
                this.speedY = Math.floor(Math.random() * -1) - 3;
            }

            else if(owner.down && this.speedY > 0) {
                this.speedY = Math.floor(Math.random() * 1) + 3;
            }

            else {
                this.speedY = Math.floor(Math.random() * 7) - 3;
            }
        }

        let ballChangeX = () => {
            if(Math.abs(this.speedX) < 0) this.speedX *= -1.03;
            else this.speedX *= -1;
            console.log(this.speedX)
        }

        if(player.x + player.width >= this.x - this.radius) {
            if(player.y <= this.y && player.y + player.height >= this.y) {
                this.speedX *= -1;
                ballChangeY(player);

                return true;
            }
        }
        
        if(this.x + this.radius >= bot.x)  {
            if(this.y > bot.y && this.y < bot.y + bot.height) {
                this.speedX *= -1;
                ballChangeY(bot);
             
                return true;
            }
        }
    }

    move() {
        this.interval *= 0.9999;
                
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.x += this.speedX;
        this.y += this.speedY;

        this.collision();
        this.draw();

        bot.move();

        player.move();
        player.draw();

        if(!this.won) {
            setTimeout(() => this.move(), this.interval);
        }        
    }
}

let ball = new Ball();

ball.draw();
ball.move(); 



document.getElementById('up').addEventListener('touchstart', () => {
    player.up = true;
})

document.getElementById('up').addEventListener('touchend', () => {
    player.up = false;
})

document.getElementById('down').addEventListener('touchstart', () => {
    player.down = true;
})

document.getElementById('down').addEventListener('touchend', () => {
    player.down = false;
})