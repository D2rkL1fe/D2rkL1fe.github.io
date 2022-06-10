canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// things
let blocks = [];
let enemies = [];

// global
let gravity = {
    x: 0,
    y: Math.abs(.1) // better to use positive number
}
let gameover = false;

// player
let pSize = {
    w: 60,
    h: 40
}
let pPos = {
    x: canvas.width - pSize.w / 2,
    y: canvas.height - pSize.h
}
let pVel = {
    x: 0,
    y: 0
}

let pS = 10;
let pJP = 5;

let pHP = 3;

let pGrounded = false;

let pMove = {
    left: false,
    right: false
}

window.addEventListener("keydown", function(e) {
    if (e.key == "a") {
        if (pGrounded) {
            pMove.left = true;
        }
    }
    if (e.key == "d") {
        if (pGrounded) {
            pMove.right = true;
        }
    }
    if (e.key == " ") {
        if (pGrounded) {
            pVel += pJP;
        }
    }
});

window.addEventListener("keyup", function(e) {

});

class Block {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render() {
        ctx.beignPath();
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    }

    update() {

    }
}

class Enemy {
    constructor(x, y, radius, speed, damage, xv, yv) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.damage = damage;
        this.xv = xv;
        this.yv = yv;
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.xv;
        this.y += this.yv;
    }
}

function clap(value, max, min) {
    return Math.min(Math.max(value, min), max);
}

function add_block(x, y, w, h) {
    blocks.push(new Block(x, y, w, h));
}

function add_enemy(x, y, r, s, xv, yv) {
    enemies.push(new Enemy(x, y, r, s, xv, yv));
}

function init() { // start blocks
    add_block(canvas.width / 4 - 100, canvas.height / 2 - 40, 200, 80);
    add_block(canvas.width - canvas.width / 4 - 100, canvas.height / 2 - 40, 200, 80);
}
init();

function render_player() {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(pPos.x, pPos.y, pSize.w, pSize.h);
    ctx.fill();
    ctx.closePath();
}

function player_move() {
    pVel.x += gravity.x;
    pVel.y += gravity.y;

    pPos.x += pVel.x;
    pPos.y += pVel.y;

    if (pMove.left) {
        pPos.x -= pS;
    }
    if (pMove.right) {
        pPos.x += pS;
    }
}

function solve_collisions() {
    // basic player's
    if (pPos.x < 0) {
        pPos.x = 0;
        pVel.x *= -1;
    } else if (pPos.x + pSize.w > canvas.width) {
        pPos.x = canvas.width - pSize.w;
        pVel.x *= -1;
    }
    if (pPos.y < 0) {
        pPos.y = 0;
        if (gravity.y >= 0) {
            pVel.y *= -1;
        } else {
            pGrounded = true;
            pVel.y = 0;
        }
    } else if (pPos.y + pSize.h > canvas.height) {
        pPos.y = canvas.height - pSize.h;
        if (gravity.y < 0) {
            pVel.y *= -1;
        } else {
            pGrounded = true;
            pVel.y = 0;
        }
    }

    // (player x block)'s
    for (let i = 0; i < blocks.length; i++) {
        if (pPos.x < blocks[i].x + blocks[i].width && pPos.x + pSize.w > blocks[i].x && pPos.y < blocks[i].y + blocks[i].height && pPos.y + pSize.h > blocks[i].y) {
            let dx = (blocks[i].x + blocks[i].width / 2) - (pPos.x + pSize.w / 2);
            let dy = (blocks[i].y + blocks[i].height / 2) - (pPos.y + pSize.h / 2);

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dy >= 0) {
                    pPos.y = blocks[i].y;
                    if (gravity.y < 0) {
                        pVel.y *= -1;
                    } else {
                        pGrounded = true;
                        pVel.y = 0;
                    }
                } else {
                    pPos.y = blocks[i].y + blocks[i].height;
                    if (gravity.y >= 0) {
                        pVel.y *= -1;
                    } else {
                        pGrounded = true;
                        pVel.y = 0;
                    }
                }
            } else {
                if (dx >= 0) {
                    pPos.x = blocks[i].x;
                    pVel *= -1;
                } else {
                    pPos.x = blocks[i].x + blocks[i].width;
                    pVel *= -1;
                }
            }
        }
    }

    // (player x enemy)'s
    for (let i = 0; i < enemies.length; i++) {
        let dx = clap(enemies[i].x, pPos.x, pPos.x + pSize.w) - enemies[i].x;
        let dy = clap(enemies[i].y, pPos.y, pPos.y + pSize.h) - enemies[i].y;
        
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < enemies[i].radius) {
            pHP -= enemies[i].damage;
            enemies.splice(i, 1);
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render_player();
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].render();
        blocks[i].update();
    }
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].render();
        enemies[i].update();
    }
    player_move();
    solve_collisions();
    requestAnimationFrame(animate);
}
animate();
