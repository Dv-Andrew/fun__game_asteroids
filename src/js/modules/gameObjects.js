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

    draw(options) {
        this.options = options || {};

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

        if (this.options.drawGuides) {
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

    child(mass) {
        return new Asteroid(this.ctx, this.x, this.y, mass, this.x_speed, this.y_speed, this.rotation_speed);
    }
}

export class Ship extends SpaceObject {
    constructor(context, x, y, thrusterPower, weaponPower, weaponReloadTime, bulletSpeed) {
        super(context, x, y, 100, 20, Math.PI * 1.5);

        this.isCompromised = false;
        this.maxHealth = 5;
        this.health = this.maxHealth;

        this.thrusterPower = (thrusterPower * 10) || 0;
        this.isThrusterOn = false;

        this.steeringPower = (thrusterPower / 2) || 0;
        this.leftThruster = false;
        this.rightThruster = false;

        this.weaponPower = weaponPower || 500; // снимает 500 единиц массы астероида за каждое попадание
        this.bulletSpeed = bulletSpeed || 200; // скорость полёта снаряда
        this.weaponReloadTime = weaponReloadTime || 0.25; //seconds
        this.timeUntilReloaded = this.weaponReloadTime;
        this.isLoaded = false;
    }

    draw(options) {
        this.options = options || {};

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);

        var strokeColor = 'white'
        if (this.isCompromised) {
            strokeColor = 'orange'
        };

        this.ctx.lineWidth = this.options.lineWidth || 2;
        this.ctx.strokeStyle = this.options.strokeStyle || strokeColor;
        this.ctx.fillStyle = this.options.fillStyle || 'black';

        let angle = (this.options.angle || Math.PI * 0.5) / 2; // угол между направляющими (не путать с углом поворота)

        let curve1 = this.options.curve1 || 0.25; // курвы отвечают за вид корабля (регулировка изгиба)
        let curve2 = this.options.curve2 || 0.75;


        if (this.isThrusterOn) {
            this.ctx.save();
            this.ctx.strokeStyle = "yellow";
            this.ctx.fillStyle = "red";
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(
                Math.cos(Math.PI + angle * 0.8) * this.radius / 2,
                Math.sin(Math.PI + angle * 0.8) * this.radius / 2
            )
            this.ctx.quadraticCurveTo(-this.radius * 2,
                0,
                Math.cos(Math.PI - angle * 0.8) * this.radius / 2,
                Math.sin(Math.PI - angle * 0.8) * this.radius / 2
            );
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.radius, 0);

        this.ctx.quadraticCurveTo(
            Math.cos(angle) * this.radius * curve2,
            Math.sin(angle) * this.radius * curve2,
            Math.cos(Math.PI - angle) * this.radius,
            Math.sin(Math.PI - angle) * this.radius
        );
        this.ctx.quadraticCurveTo(-this.radius * curve1,
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

        if (this.options.drawGuides) {
            //circle around ship
            if (this.isCompromised) {
                this.ctx.strokeStyle = 'red';
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
            } else {
                this.ctx.strokeStyle = 'green';
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.15)';
            }
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

    update(elapsed) {
        this.push(this.angle, this.isThrusterOn * this.thrusterPower, elapsed);
        this.twist((this.rightThruster - this.leftThruster) * this.steeringPower, elapsed);
        SpaceObject.prototype.update.apply(this, arguments); // прикольная фишка, надо обязательно запомнить!

        //перезарядка:
        this.isLoaded = this.timeUntilReloaded === 0; //true if timeUntilReloaded === 0;
        if (!this.isLoaded) {
            this.timeUntilReloaded -= Math.min(elapsed, this.timeUntilReloaded);
        }

        if (this.isCompromised) {
            this.health -= Math.min(elapsed, this.health);
        }
    }


    shoot(elapsed) {
        var p = new Projectile(
            this.ctx,
            this.x + Math.cos(this.angle) * this.radius,
            this.y + Math.sin(this.angle) * this.radius,
            0.015, //mass
            2, //lifeTime
            this.x_speed,
            this.y_speed,
            this.rotation_speed);

        p.push(this.angle, this.bulletSpeed, elapsed);
        this.push(this.angle + Math.PI, this.bulletSpeed, elapsed);

        this.timeUntilReloaded = this.weaponReloadTime;

        return p;
    }
}


export class Projectile extends SpaceObject {
    constructor(context, x, y, mass, lifeTime, x_speed, y_speed, rotation_speed) {
        var density = 0.001; // kg per square pixel
        var radius = Math.sqrt((mass / density) / Math.PI);

        super(context, x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);

        this.lifeTime = lifeTime;
        this.life = 1.0;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);

        this.ctx.lineWidth = 0.5;
        this.ctx.strokeStyle = 'rgba(255, 255, 0,' + Math.max(this.life, 0.7) + ')';
        this.ctx.fillStyle = 'rgba(255, 100, 0,' + Math.max(this.life, 0.7) + ')';

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2); // пока просто кружок
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    update(elapsed) {
        this.life -= (elapsed / this.lifeTime);
        SpaceObject.prototype.update.apply(this, arguments);
    }
}

export class ProgressIndicator {
    constructor(context, x, y, width, height, label) {
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.label = label + ': ';
    }

    draw(maxValue, currentValue) {
        this.ctx.save();

        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'white';
        this.ctx.font = this.height + 'px Arial';

        var offset = this.ctx.measureText(this.label).width;

        this.ctx.fillText(this.label, this.x, this.y + this.height - 1);

        this.ctx.beginPath();
        this.ctx.rect(this.x + offset, this.y, this.width, this.height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.rect(this.x + offset, this.y, this.width * (currentValue / maxValue), this.height);
        this.ctx.fill();

        this.ctx.restore();
    }
}

export class NumbersIndicator {
    constructor(context, x, y, label, options) {
        this.ctx = context;
        this.x = x;
        this.y = y;

        options = options || {};

        this.label = label + ': ' || 'undefined label';
        this.digits = options.digits || 0;
        this.textSize = options.textSize || '10'
        this.textAlign = options.textAlign || 'end';
    }

    draw(value) {
        this.ctx.save();

        this.ctx.fillStyle = 'white';
        this.ctx.font = this.textSize + 'px Arial';
        this.ctx.textAlign = this.textAlign;
        
        this.ctx.fillText(
            this.label + value.toFixed(this.digits),
            this.x,
            this.y
        );

        this.ctx.restore();
    }
}

export class Message {
    constructor(context, x, y, options) {
        this.ctx = context;
        this.x = x || this.ctx.canvas.width / 2;
        this.y = y || this.ctx.canvas.height / 2;

        options = options || {};

        this.mainTextSize = options.mainTextSize || 32;
        this.subTextSize = options.subTextSize || 24;
        this.textAlign = options.textAlign || 'center';
        this.fill = options.fill || 'white';
    }

    draw(mainText, subText, score) {
        this.ctx.save();

        this.ctx.fillStyle = this.fill;
        this.ctx.textAlign = this.textAlign;
        this.ctx.font = this.mainTextSize + 'px Arial';
        this.ctx.fillText(mainText, this.x, this.y);
        this.ctx.font = this.subTextSize + 'px Arial';
        if(score != undefined) {
            let text = 'Your score: ' + score.toFixed(0);
            this.ctx.fillText(text, this.x, this.y + this.mainTextSize);
            this.ctx.fillText(subText, this.x, this.y + this.mainTextSize + this.subTextSize * 1.2);
        } else {
            this.ctx.fillText(subText, this.x, this.y + this.mainTextSize);
        }

        this.ctx.restore();
    }
}