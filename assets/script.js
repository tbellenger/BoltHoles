let r = 1;
let h = 4;
let s = 0;
let tick = 0;
// get the canvas
let c = document.getElementById("myChart");
let ctx = c.getContext("2d");
// calculate extents and midpoint
let canvY = c.height;
let canvX = c.width;
let canvMidX = canvX / 2;
let canvMidY = canvY / 2;

// get page search params for hole circle params
document.getElementById("graph").onclick = function () {
    ctx.beginPath();
    ctx.clearRect(0, 0, c.width, c.height);
    r = document.getElementById("r").value;
    h = document.getElementById("h").value;
    s = document.getElementById("s").value;
    let d = holes(r, h, s);
    draw(d);
}

//change degrees to radians
function toRadians (angle) {
    return angle * (Math.PI / 180);
}

// calculate hole from center
function hole(radius, angle) {
    let a = (Math.cos(angle) * radius).toFixed(4);
    let b = (Math.sin(angle) * radius).toFixed(4);
    return {x:a, y:b};
}

// calculate number of holes and angles for each point
function holes(radius, numHoles, startAngle) {
    let angle = 360 / numHoles;
    let currHole = 0;
    let points = [];

    while (currHole < numHoles) {
        points[currHole] = hole(radius, toRadians((angle * currHole) + parseFloat(startAngle)));
        currHole++;
    }
    return points;
}

function draw(d) {
    // draw x and y axis
    ctx.moveTo(canvMidX, 0);
    ctx.lineTo(canvMidX, canvY);
    ctx.stroke();
    ctx.moveTo(0, canvMidY);
    ctx.lineTo(canvX, canvMidY);
    ctx.stroke();

    // calculate tick size according to canvas size
    tick = Math.min(canvX, canvY) / ((2 * r) + 1);

    // draw holes and point text
    d.forEach(drawPoint);

    // draw bolt hole circle
    ctx.beginPath()
    ctx.arc(canvMidX, canvMidY, tick * r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    // draw the ticks on the axes
    drawTicks(r, tick, tick);
}

// draw a point and text on the canvas
function drawPoint(item, index) {
    let circX = (canvMidX + (tick * parseFloat(item.x)));
    let circY = (canvMidY - (tick * parseFloat(item.y)));
    ctx.beginPath();
    ctx.arc(circX, circY, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.font = "11px Arial";
    ctx.strokeText(item.x + ", " + item.y, circX-40, circY+20);
}

// draw the ticks on the axes
function drawTicks(rad, tx, ty) {
    let counter = 0;
    // bolt hole circle was scaled to fit in radius + 1
    while (counter < parseFloat(rad) + 1) {
        let tkSz = 0;
        // set larger tick for whole number points on axes
        if (decimalNumber(counter)) {
            tkSz = 2;
        } else {
            tkSz = 4;
        }
        // above and below the x axis on both negative and positive sides
        ctx.moveTo(canvMidX + counter * tx, canvMidY - tkSz);
        ctx.lineTo(canvMidX + counter * tx, canvMidY + tkSz);
        ctx.stroke();
        ctx.moveTo(canvMidX - counter * tx, canvMidY - tkSz);
        ctx.lineTo(canvMidX - counter * tx, canvMidY + tkSz);
        ctx.stroke();
        // to the left and right of the y axis on both negative and positive sides
        ctx.moveTo(canvMidX - tkSz, canvMidY + counter * ty);
        ctx.lineTo(canvMidX + tkSz, canvMidY + counter * ty);
        ctx.stroke();
        ctx.moveTo(canvMidX - tkSz, canvMidY - counter * ty);
        ctx.lineTo(canvMidX + tkSz, canvMidY - counter * ty);
        ctx.stroke();
        // work in .5 increments for the ticks
        counter = counter + 0.5;

    }
}

// check whether the point is whole number or decimal
function decimalNumber(num) {
    return (num - Math.floor(num)) !== 0;
}