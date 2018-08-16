import {drawShip, drawAsteroid } from './learnCanvas.min.js';

export function Asteroid(ctx, segments, radius, noise) {
    this.x = ctx.canvas.width * Math.random();
    this.y = ctx.canvas.height * Math.random();

    this.angle = 0;

    this.x_speed = ctx.canvas.width * (Math.random() - 0.5);
    this.y_speed = ctx.canvas.height * (Math.random() - 0.5);

    this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5);

    this.radius = radius;
    this.noise = noise;
    this.shape = [];

    for(let i = 0; i < segments; i++) {
        this.shape.push(Math.random() - 0.5);
    }
}
Asteroid.prototype.update = function(ctx, elapsed) {
    if(this.x - this.radius + elapsed * this.x_speed > ctx.canvas.width) {
        this.x = -this.radius;
    }
    if(this.x + this.radius + elapsed * this.x_speed < 0) {
        this.x = ctx.canvas.width + this.radius;
    }

    if(this.y - this.radius + elapsed * this.y_speed > ctx.canvas.height) {
        this.y = -this.radius;
    }
    if(this.y + this.radius + elapsed * this.y_speed < 0) {
        this.y = ctx.canvas.height + this.radius;
    }

    this.x += elapsed * this.x_speed;
    this.y += elapsed * this.y_speed;
    this.angle = (this.angle + this.rotation_speed * elapsed) % (2 * Math.PI);
}
Asteroid.prototype.draw = function(ctx, guide) {
    ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        drawAsteroid(ctx, this.radius, this.shape, {
            guide: guide,
            noise: this.noise
        });
    ctx.restore();
}