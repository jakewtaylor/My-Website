/* Relative */
import { getRandomInt, getRandomColor } from '../../helpers';

class Particle {
    constructor (x, y, canvas, color = getRandomColor()) {
        this.position = {
            x,
            y,
        };

        this.velocity = {
            x: 0,
            y: getRandomInt(-15, -20),
        };

        this.acceleration = {
            x: 0,
            y: 0,
        };

        this.canvas = canvas;
        this.color = color;
    }

    update = () => {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.x *= 0;
        this.acceleration.y *= 0;
    }

    applyForce = (force) => {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    draw = () => {
        if (!this.canvas) { return; }

        const context = this.canvas.getContext('2d');

        context.beginPath();

        context.arc(this.position.x, this.position.y, 2.5, 0, 2 * Math.PI);

        // Styles
        context.fillStyle = this.color;
        context.strokeStyle = this.color;

        // Draw
        context.fill();
        context.stroke();

        context.closePath();
    }
}

class ChildParticle extends Particle {
    constructor (x, y, canvas, color = getRandomColor()) {
        super(x, y, canvas, color);

        this.velocity = {
            x: Math.random() * getRandomInt(-15, 15),
            y: Math.random() * getRandomInt(-15, 15),
        };

        this.lifespan = 1;
    }

    valid = () => this.lifespan <= 0

    update = () => {
        this.velocity.x *= 0.85;
        this.velocity.y *= 0.85;

        this.lifespan -= 0.01;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.x *= 0;
        this.acceleration.y *= 0;
    }

    draw = () => {
        if (!this.canvas) { return; }

        const context = this.canvas.getContext('2d');

        context.beginPath();
        // Fade out
        context.globalAlpha = this.lifespan > 0 ? this.lifespan : 0;
        // Slightly smaller circles
        context.arc(this.position.x, this.position.y, 1.5, 0, 2 * Math.PI);

        // Styles
        context.fillStyle = this.color;
        context.strokeStyle = this.color;

        // Draw
        context.fill();
        context.stroke();

        context.closePath();
    }
}

export { ChildParticle, Particle };
