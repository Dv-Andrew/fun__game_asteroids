export function drawGrid(ctx, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || '#00ff00';
    fill = fill || '#009900';

    ctx.save();

    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;

    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    for(var x = 0; x < width; x+=minor) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
        if (x % major == 0) {
            ctx.fillText(x, x + 2, 10);
        }
    }
    for(var y = 0; y < height; y+=minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
        if (y % major == 0) {
            if (y != 0) {
                ctx.fillText(y, 2, y + 10);
            }
        }
    }

    ctx.restore();
}

export function drawPackman(ctx, x, y, radius, mouth) {
    x = x || ctx.canvas.width / 2;
    y = y || ctx.canvas.height / 2;
    radius = radius || 100;
    mouth = mouth || 0;

    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(x, y, radius, Math.PI * (0 + (mouth / 4)), Math.PI * (2 - (mouth / 4)));
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

export function drawShip(ctx, radius, options) {
    options = options || {};

    ctx.save();

    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.strokeStyle || 'white';
    ctx.fillStyle = options.fillStyle || 'black';

    let angle = (options.angle || Math.PI * 0.5) / 2; // угол между направляющими (не путать с углом поворота)

    let curve1 = options.curve1 || 0.25;
    let curve2 = options.curve2 || 0.75;

    ctx.beginPath();
    ctx.moveTo(radius, 0);

    ctx.quadraticCurveTo(
        Math.cos(angle) * radius * curve2,
        Math.sin(angle) * radius * curve2,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius
    );
    ctx.quadraticCurveTo( -radius * curve1 - radius, 0,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius
    );
    ctx.quadraticCurveTo(
        Math.cos(-angle) * radius * curve2,
        Math.sin(-angle) * radius * curve2,
        radius, 0
    );

    // ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if(options.guide) {
        //circle around ship
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'rgba(255, 150, 0, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        //guide curves
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(-angle) * radius,
            Math.sin(-angle) * radius
        );
        ctx.lineTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        );
        ctx.moveTo(-radius, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            Math.cos(angle) * radius * curve2,
            Math.sin(angle) * radius * curve2,
            radius/40, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
            Math.cos(-angle) * radius * curve2,
            Math.sin(-angle) * radius * curve2,
            radius/40, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(radius * curve1 - radius, 0, radius/50, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

export function drawAsteroid(ctx, radius, shape, options) {
    options = options || {};

    ctx.save();

    const noise = options.noise || 0.3;

    ctx.lineWidth = options.lineWidth || 1;
    ctx.strokeStyle = options.strokeStyle || 'white';
    ctx.fillStyle = options.fillStyle || 'black';

    ctx.beginPath();

    for (let i = 0; i < shape.length; i++) {
        ctx.rotate((Math.PI * 2) / shape.length );
        // ctx.lineTo(radius + radius * noise * (Math.random() - 0.8), 0);
        ctx.lineTo(radius + radius * noise * shape[i], 0);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if(options.guide) {
        //circle around asteroid
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'rgba(255, 150, 0, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }

    ctx.restore();
}