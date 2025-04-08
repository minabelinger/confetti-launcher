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
      const newConf = JSON.parse(JSON.stringify(conf));
      if (newConf.shapeOptions.type == "image") {
        newConf.offscreenCanvas = conf.offscreenCanvas;
      }
      this.queue.push(newConf);
    }
  }

  animateConfettiQueue() {
    if (!this.ctx) {
      this.setup();
    }
    this.ctx.reset();

    const currentTime = performance.now();

    if (this.lastTime === undefined) {
      this.lastTime = currentTime;
    }

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.queue = this.queue.filter((conf) => {
      animateConfetti(conf, deltaTime, this.ctx, this.lightDir);
      return (
        (conf.position.y <= this.canvasHeight + this.destroyDistance &&
          conf.lifetime.current < conf.lifetime.duration &&
          conf.lifetime.enabled) ||
        (conf.lifetime.current < conf.lifetime.duration && conf.lifetime.enabled)
      );
    });

    if (this.queue.length) {
      requestAnimationFrame(this.animateConfettiQueue.bind(this));
    } else {
      this.isPlaying = false;
      this.lastTime = undefined;
      console.log("Animation complete.");
    }
  }

  startAnimation() {
    if (this.queue.length) {
      this.isPlaying = true;
      requestAnimationFrame(this.animateConfettiQueue.bind(this));
    }
  }
}
