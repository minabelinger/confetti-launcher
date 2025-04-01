import { ProgramUpdateLevel } from "typescript";
import { animateConfetti } from "./confetti";

export class ConfettiAnimator {
  constructor(config, canvas) {
    this.config = config;
    this.canvas = canvas;
    this.ctx = null;
    this.queue = [];
    this.lastTime = undefined;
    this.destroyDistance = 0;
    this.lightDir = [0, 0, 0];
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.isPlaying = false;
  }

  setup() {
    this.ctx = this.canvas.getContext("2d");
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    const lightMagnitude = Math.sqrt(
      this.config.light_dir[0] * this.config.light_dir[0] +
        this.config.light_dir[1] * this.config.light_dir[1] +
        this.config.light_dir[2] * this.config.light_dir[2]
    );

    this.lightDir = [
      this.config.light_dir[0] / lightMagnitude,
      this.config.light_dir[1] / lightMagnitude,
      this.config.light_dir[2] / lightMagnitude,
    ];
  }

  addConfettiToQueue(confList) {
    this.destroyDistance = this.config.destroyDistance;

    for (const conf of confList) {
      this.queue.push(JSON.parse(JSON.stringify(conf)));
    }
    console.log(confList[0].position);

    console.log(this.queue);
  }

  animateConfettiQueue(timestamp) {
    if (!this.ctx) {
      this.setup(); // Try to set up context
    }
    this.ctx.reset();

    if (this.lastTime === undefined) {
      this.lastTime = timestamp;
    }

    const deltaTime = (timestamp - this.lastTime) / 144;
    this.lastTime = timestamp;

    for (let i = 0; i < this.queue.length; i++) {
      const conf = this.queue[i];
      animateConfetti(conf, deltaTime, this.ctx, this.lightDir);
      if (conf.position.y > this.canvasHeight + this.destroyDistance) {
        this.queue.splice(i, 1);
      }
    }
    if (this.queue.length) {
      requestAnimationFrame(this.animateConfettiQueue.bind(this));
    } else {
      this.isPlaying = false;
      this.lastTime = undefined;
      console.log("huh");
    }
  }

  startAnimation() {
    if (this.queue.length) {
      this.isPlaying = true;
      requestAnimationFrame(this.animateConfettiQueue.bind(this));
    }
  }
}
