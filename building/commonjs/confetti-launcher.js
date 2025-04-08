import { ConfettiAnimator } from "./confetti-animator.js";

export class ConfettiLauncher {
  constructor(config, launcher, confList, canvas) {
    this.config = config;
    this.launcher = launcher;
    this.confList = confList;
    this.canvas = canvas;
    this.animator = undefined;
    this.time = 0;

    for (const conf of this.confList) {
      if (conf.shapeOptions.type == "image") {
        (async () => {
          const img = new Image(conf.shapeOptions.width, conf.shapeOptions.height);
          await new Promise((resolve) => {
            img.onload = () => {
              resolve();
            };

            img.onerror = (error) => {
              console.error("Failed to load image:", error);
              reject(error);
            };

            img.src = conf.shapeOptions.image.src;
          });
          const offscreenCanvas = document.createElement("canvas");
          offscreenCanvas.width = conf.shapeOptions.width;
          offscreenCanvas.height = conf.shapeOptions.height;
          const offscreenCtx = offscreenCanvas.getContext("2d");
          offscreenCtx.drawImage(img, 0, 0, conf.shapeOptions.width, conf.shapeOptions.height);
          conf.offscreenCanvas = offscreenCanvas;
        })();
      }
    }
  }

  shoot() {
    if (!this.animator) {
      this.animator = new ConfettiAnimator(this.config, this.canvas);
    }
    const amount = Math.random() * (this.launcher.amount[1] - this.launcher.amount[0]) + this.launcher.amount[0];
    const confettis = [];
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * this.confList.length);
      confettis[i] = this.modifyConfetti(this.confList[randomIndex]);
    }

    this.animator.addConfettiToQueue(confettis);
    if (!this.animator.isPlaying) {
      this.animator.startAnimation();
    }

    if (this.launcher.delay && this.time <= this.launcher.duration) {
      this.time += this.launcher.delay;
      setTimeout(() => {
        this.shoot();
      }, this.launcher.delay * 1000);
    } else {
      this.time = 0;
    }
  }

  modifyConfetti(conf) {
    const newConf = JSON.parse(JSON.stringify(conf));

    if (newConf.shapeOptions.type == "image") {
      newConf.offscreenCanvas = conf.offscreenCanvas;
    }

    newConf.position.x = this.launcher.position.x;
    newConf.position.y = this.launcher.position.y;

    const dir =
      Math.random() * (this.launcher.direction.end - this.launcher.direction.start) + this.launcher.direction.start;
    const strenght =
      Math.random() * (this.launcher.strength[1] - this.launcher.strength[0]) + this.launcher.strength[0];
    const velocity = [-Math.cos(dir) * strenght, -Math.sin(dir) * strenght];

    newConf.velocity.x = velocity[0];
    newConf.velocity.y = velocity[1];

    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const z = Math.random() * 2 - 1;
    const w = 1 - x - y - z;

    newConf.quaternion = {
      w: w,
      x: x,
      y: y,
      z: z,
    };

    if (newConf.randomColor) {
      const index = Math.floor(Math.random() * this.launcher.colors.length);
      newConf.color = this.launcher.colors[index];
    }

    return newConf;
  }

  setPosition(x, y) {
    this.launcher.position.x = x;
    this.launcher.position.y = y;
  }
  a;
}
