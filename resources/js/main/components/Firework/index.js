/* Relative */
import { getRandomInt, getRandomColor } from '../../helpers';
import { Particle, ChildParticle } from '../Particle';

class Firework {
    constructor (canvas) {
        this.canvas = canvas;

        // Something weird happens here...
        // Sometimes the color changes for child particles
        this.color = getRandomColor();

        this.firework = new Particle(getRandomInt(0, canvas.width), canvas.height, canvas, this.color);

        this.exploded = false;

        this.particles = [];
    }

    valid = () => this.exploded && this.particles.length <= 0

    update = () => {
        const { exploded, firework, explode } = this;
        const { applyForce, update, velocity } = firework;

        const gravity = {
            x: 0,
            y: 0.2,
        };

        if (!exploded) {
            applyForce(gravity);
            update();

            // If we've got 0 velocity or above, we've hit our apex.
            // Let's explode the particle
            if (velocity.y >= 0) {
                explode();
            }
        } else {
            // Update each child particle
            this.particles.forEach((particle) => {
                particle.applyForce(gravity);
                particle.update();
            });

            // Remove any invalid particles
            this.particles = this.particles.filter(particle => !particle.valid());
        }
    }

    explode = () => {
        const {
            firework, canvas, particles, color,
        } = this;

        // Make 100 child particles
        Array(...Array(100)).forEach(() => {
            particles.push(
                new ChildParticle(firework.position.x, firework.position.y, canvas, color),
            );
        });

        this.exploded = true;
    }

    draw = () => {
        const { draw } = this.firework;

        if (!this.exploded) {
            draw();
        }

        // Draw each child particle
        this.particles.forEach(particle => particle.draw());
    }
}

export default Firework;
