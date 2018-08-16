import {drawShip, drawAsteroid } from './learnCanvas.min.js';

export class Asteroid {
    constructor (context, segments, radius, noise) {
        this.ctx = context;
        this.x = this.ctx.canvas.width * Math.random();
        this.y = this.ctx.canvas.height * Math.random();

        this.angle = 0;

        this.x_speed = this.ctx.canvas.width * (Math.random() - 0.5);
        this.y_speed = this.ctx.canvas.height * (Math.random() - 0.5);

        this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5);

        this.radius = radius;
        this.noise = noise;
        this.shape = [];

        for(let i = 0; i < segments; i++) {
            this.shape.push(Math.random() - 0.5);
        }
    }

    update(elapsed) {
        if(this.x - this.radius + elapsed * this.x_speed > this.ctx.canvas.width) {
            this.x = -this.radius;
        }
        if(this.x + this.radius + elapsed * this.x_speed < 0) {
            this.x = this.ctx.canvas.width + this.radius;
        }
    
        if(this.y - this.radius + elapsed * this.y_speed > this.ctx.canvas.height) {
            this.y = -this.radius;
        }
        if(this.y + this.radius + elapsed * this.y_speed < 0) {
            this.y = this.ctx.canvas.height + this.radius;
        }
    
        this.x += elapsed * this.x_speed;
        this.y += elapsed * this.y_speed;
        this.angle = (this.angle + this.rotation_speed * elapsed) % (2 * Math.PI);
    }

    draw(guide) {
        this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle);
    
            drawAsteroid(this.ctx, this.radius, this.shape, {
                guide: guide,
                noise: this.noise
            });
            this.ctx.restore();
    }
}