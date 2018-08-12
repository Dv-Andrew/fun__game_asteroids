export function drawGrid(cvs, ctx, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || '#00ff00';
    fill = fill || '#009900';

    ctx.save();

    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;

    let width = cvs.width;
    let height = cvs.height;

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

export function drawPackman(cvs, ctx, x, y, radius, mouth) {
    x = x || cvs.width / 2;
    y = y || cvs.height / 2;
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

export function drawShip(cvs, ctx, x, y, radius, options) {
    options = options || {};

    ctx.save();

    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.strokeStyle || 'white';
    ctx.fillStyle = options.fillStyle || 'black';

    let angle = (options.angle || Math.PI * 0.5) / 2;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(
        x + Math.cos(Math.PI - angle) * radius,
        y + Math.sin(Math.PI - angle) * radius
    );
    ctx.lineTo(
        x + Math.cos(Math.PI + angle) * radius,
        y + Math.sin(Math.PI + angle) * radius
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if(options.guide) {
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'rgba(255, 150, 0, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }

    ctx.restore();
}