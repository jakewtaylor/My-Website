/* Node */
import React, { Component, createRef } from 'react';

/* Relative */
import { getRandomInt } from './helpers';
import Firework from './components/Firework';

class App extends Component {
    state = {
        fireworks: [],
        visibility: {
            visible: true,
            hidden: '',
            visibilityChange: '',
        },
    }

    fireworkInterval = null;

    cleanInterval = null;

    canvas = createRef();

    componentDidMount () {
        this.setupVisibilityListener();
        this.setupCanvas();

        // Clean our state and animate our canvas every 10ms
        this.cleanInterval = setInterval(() => {
            this.cleanFireworks(this.animateFireworks);
        }, 10);

        // Every 300-600ms, create another firework
        this.fireworkInterval = setInterval(() => {
            this.createFirework();
        }, getRandomInt(300, 600));
    }

    componentWillUnmount () {
        clearInterval(this.cleanInterval);
        clearInterval(this.fireworkInterval);
    }

    setupVisibilityListener = () => this.setState((current) => {
        const next = { ...current };

        if (typeof document.hidden !== "undefined") {
            next.visibility.hidden = "hidden";
            next.visibility.visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            next.visibility.hidden = "msHidden";
            next.visibility.visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            next.visibility.hidden = "webkitHidden";
            next.visibility.visibilityChange = "webkitvisibilitychange";
        }

        return next;
    }, () => {
        const { visibility } = this.state;

        document.addEventListener(visibility.visibilityChange, this.handleVisibilityChange, false);
    })

    handleVisibilityChange = () => this.setState((current) => {
        const next = { ...current };

        next.visibility.visible = !document[next.visibility.hidden];

        return next;
    })

    /**
     * Setup our canvas dimensions
     */
    setupCanvas = () => {
        const { innerWidth: width, innerHeight: height } = window;

        this.canvas.current.width = width;
        this.canvas.current.height = height;
    }

    /**
     * Create a single firework
     */
    createFirework = () => this.setState((current) => {
        const next = { ...current };

        // If our screen is in the foreground, add more fireworks
        if (next.visibility.visible) {
            next.fireworks.push(new Firework(this.canvas.current));
        }

        return next;
    })

    /**
     * Animate our existing fireworks
     */
    animateFireworks = () => {
        const { fireworks } = this.state;

        // Grab our context from our canvas
        const context = this.canvas.current.getContext('2d');

        // Grab the width and height from our canvas
        const { width, height } = this.canvas.current;

        // Reset the canvas
        context.clearRect(0, 0, width, height);

        // Draw our fireworks
        fireworks.forEach((firework) => {
            firework.update();
            firework.draw();
        });
    }

    /**
     * Remove all our invalid fireworks
     */
    cleanFireworks = cb => this.setState((current) => {
        const next = { ...current };

        // Remove any invalid fireworks
        next.fireworks = next.fireworks.filter(firework => !firework.valid());

        return next;
    }, cb)

    render () {
        return <canvas ref={this.canvas} />;
    }
}

export default App;
