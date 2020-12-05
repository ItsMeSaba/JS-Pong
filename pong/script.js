document.documentElement.style.setProperty('--bodyHeight', `${window.innerHeight}px`);

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

document.getElementById('restart').addEventListener('click', () => location.reload());



class Player {
    constructor() {
        this.width = 10;
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
        this.width = 10;
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
        this.radius = 9;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.ball = [{ x : canvas.width/2, y : canvas.height/2 }]
        this.speedX = this.radius;
        this.speedY = 1;
        this.interval = 1000/60;
        this.won = false;
        this.rgb = {
            r : 255,
            g : 255,
            b : 255,
            setRgb : function() {
                let rand = () => Math.floor(Math.random() * 206) + 50;

                this.r = rand(); 
                this.g = rand();
                this.b = rand();
            }
        }
    }

    draw() {
        this.ball.forEach((ball, index) => {
            ctx.beginPath();
            // ctx.arc(ball.x, ball.y, this.radius - index*.75, 0, 2*Math.PI);
            ctx.arc(ball.x, ball.y, this.radius, 0, 2*Math.PI);
            // ctx.fillStyle = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${1 - index*0.1})`;
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - index*0.1})`;
            ctx.fill();
            ctx.closePath();
        })
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


        let ballChangeY = owner => {
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

        // let ballChangeX = () => {
        //     if(Math.abs(this.speedX) < 0) this.speedX *= -1.03;
        //     else this.speedX *= -1;
        //     console.log(this.speedX)
        // }

        if(player.x + player.width >= this.x - this.radius) {
            if(player.y <= this.y && player.y + player.height >= this.y) {
                this.speedX *= -1;
                ballChangeY(player);

                this.rgb.setRgb();
                
                return true;
            }
        }
        
        if(this.x + this.radius >= bot.x)  {
            if(this.y > bot.y && this.y < bot.y + bot.height) {
                this.speedX *= -1;
                ballChangeY(bot);
             
                this.rgb.setRgb();

                return true;
            }
        }
    }

    drawLine() {
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
    }

    move() {
        this.interval *= 0.9999;
                
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        this.drawLine()
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.ball.unshift({ x : this.x, y : this.y});

        if(this.ball.length > 11) this.ball.pop();
 
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