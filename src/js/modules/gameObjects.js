export class SpaceObject {
    constructor(context, x, y, mass, radius, angle, x_speed, y_speed, rotation_speed) {
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.mass = mass || 1;
        this.radius = radius || 50;
        this.angle = angle || 0;
        this.x_speed = x_speed || 0;
        this.y_speed = y_speed || 0;
        this.rotation_speed = rotation_speed || 0;
    }

    update(elapsed) {
        this.x += this.x_speed * elapsed;
        this.y += this.y_speed * elapsed;
        this.angle += this.rotation_speed * elapsed;
        this.angle %= (Math.PI * 2);

        if (this.x - this.radius > this.ctx.canvas.width) {
            this.x = -this.radius;
        }
        if (this.x + this.radius < 0) {
            this.x = this.ctx.canvas.width + this.radius;
        }
        if (this.y - this.radius > this.ctx.canvas.height) {
            this.y = -this.radius;
        }
        if (this.y + this.radius < 0) {
            this.y = this.ctx.canvas.height + this.radius;
        }
    }

    push(angle, force, elapsed) {
        this.x_speed += elapsed * (Math.cos(angle) * force) / this.mass;
        this.y_speed += elapsed * (Math.sin(angle) * force) / this.mass;
    }

    twist(force, elapsed) {
        this.rotation_speed += elapsed * force / this.mass;
    }

    speed() {
        return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2));
    }
    movement_angle() {
        return Math.atan2(this.y_speed, this.x_speed);
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.ctx.lineTo(0, 0);
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.stroke();
        this.ctx.restore();
    }
}

export class Asteroid extends SpaceObject {
    constructor(context, x, y, mass, x_speed, y_speed, rotation_speed) {
        var density = 1; // kg per square pixel
        var radius = Math.sqrt((mass / density) / Math.PI);

        super(context, x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);

        this.circumference = 2 * Math.PI * this.radius; // длина окружности
        this.segments = Math.ceil(this.circumference / 15);
        this.segments = Math.min(25, Math.max(5, this.segments));
        this.noise = 0.2;
        this.shape = [];

        for (var i = 0; i < this.segments; i++) {
            this.shape.push(2 * (Math.random() -
                0.5));
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'black';

        this.ctx.beginPath();

        for (let i = 0; i < this.shape.length; i++) {
            this.ctx.rotate((Math.PI * 2) / this.shape.length);
            this.ctx.lineTo(this.radius + this.radius * this.noise * this.shape[i], 0);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        let guide = true; // отрисовывать ли рамку
        if (guide) {
            //circle around asteroid
            this.ctx.strokeStyle = 'red';
            this.ctx.fillStyle = 'rgba(255, 150, 0, 0.15)';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fill();
        }

        this.ctx.restore();
    }
}

export class Ship extends SpaceObject {
    constructor(context, x, y) {
        super(context, x, y, 10, 20, Math.PI * 1.5);
    }

    draw(options) {
        this.options = options || {};

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);

        this.ctx.lineWidth = this.options.lineWidth || 2;
        this.ctx.strokeStyle = this.options.strokeStyle || 'white';
        this.ctx.fillStyle = this.options.fillStyle || 'black';

        let angle = (this.options.angle || Math.PI * 0.5) / 2; // угол между направляющими (не путать с углом поворота)

        let curve1 = this.options.curve1 || 0.25; // курвы отвечают за вид корабля (регулировка изгиба)
        let curve2 = this.options.curve2 || 0.75;

        this.ctx.beginPath();
        this.ctx.moveTo(this.radius, 0);

        this.ctx.quadraticCurveTo(
            Math.cos(angle) * this.radius * curve2,
            Math.sin(angle) * this.radius * curve2,
            Math.cos(Math.PI - angle) * this.radius,
            Math.sin(Math.PI - angle) * this.radius
        );
        this.ctx.quadraticCurveTo(
            -this.radius * curve1 - this.radius,
            0,
            Math.cos(Math.PI + angle) * this.radius,
            Math.sin(Math.PI + angle) * this.radius
        );
        this.ctx.quadraticCurveTo(
            Math.cos(-angle) * this.radius * curve2,
            Math.sin(-angle) * this.radius * curve2,
            this.radius,
            0
        );

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        let guide = true; // отрисовывать ли рамку
        if (guide) {
            //circle around ship
            this.ctx.strokeStyle = 'red';
            this.ctx.fillStyle = 'rgba(255, 150, 0, 0.15)';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fill();

            //guide curves
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(
                Math.cos(-angle) * this.radius,
                Math.sin(-angle) * this.radius
            );
            this.ctx.lineTo(0, 0);
            this.ctx.lineTo(
                Math.cos(angle) * this.radius,
                Math.sin(angle) * this.radius
            );
            this.ctx.moveTo(-this.radius, 0);
            this.ctx.lineTo(0, 0);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(
                Math.cos(angle) * this.radius * curve2,
                Math.sin(angle) * this.radius * curve2,
                this.radius / 40,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(
                Math.cos(-angle) * this.radius * curve2,
                Math.sin(-angle) * this.radius * curve2,
                this.radius / 40,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.radius * curve1 - this.radius, 0, this.radius / 50, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }
}