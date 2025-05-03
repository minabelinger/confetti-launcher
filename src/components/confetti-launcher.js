import { ConfettiAnimator } from "./confetti-animator.js";

export class ConfettiLauncher {
  constructor(launcher, confList, canvas) {
    this.launcher = launcher;
    this.confList = [];
    this.canvas = canvas;
    this.animator = undefined;
    this.time = 0;

    this.confList = confList.map((conf) => {
      return this.initConf(conf);
    });

    this.confList.forEach((conf) => {
      this.defineImage(conf);
    });

    this.initConfig();
    this.initLauncher();
  }

  initConfig() {
    const defaultConfig = {
      destroyDistance: 200,
      light_dir: [-2, -10, -0.5],
    };

    this.config = Object.assign(defaultConfig, this.config);
  }

  initLauncher() {
    const defaultLauncher = {
      position: {
        x: 0,
        y: 0,
      },
      direction: {
        start: 0,
        end: Math.PI * 2,
      },
      shootRepetition: {
        duration: 0,
        delay: 0,
      },
      amount: [10, 10],
      strength: [100, 100],
      colors: [],
      destroyDistance: 300,
      light_dir: [-1, -1, -0.5],
    };

    this.launcher = Object.assign(defaultLauncher, this.launcher);
  }

  initConf(conf) {
    const defaultConf = {
      position: { x: 1, y: 1 },
      velocity: { x: 0, y: 0, maxFallspeed: 500, gravity: 250, airdrag: 20 },
      quaternion: { w: 1, x: 0, y: 0, z: 0 },
      quaternionVelocity: { w: 0, x: 3, y: 3, z: 0 },
      color: "#3b96ff",
      randomColor: false,
      shading: false,
      shapeOptions: {
        type: "ellipse",
        width: 10,
        height: 6,
        shininess: 2,
        shadows: 0.5,
      },
      lifetime: {
        enabled: false,
        onset: 0,
        duration: 0,
        current: 0,
      },
      velocity: {
        x: 0,
        y: 0,
        maxFallspeed: 500,
        gravity: 250,
        airdrag: 20,
      },
      alpha: 1,
      randomRotation: false,
    };

    const merged = Object.assign(defaultConf, conf);
    return merged;
  }

  defineImage(conf) {
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

  shoot() {
    if (!this.animator) {
      this.animator = new ConfettiAnimator(
        { light_dir: this.launcher.light_dir, destroyDistance: this.launcher.destroyDistance },
        this.canvas
      );
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

    if (this.launcher.shootRepetition.delay && this.time <= this.launcher.shootRepetition.duration) {
      this.time += this.launcher.shootRepetition.delay;
      setTimeout(() => {
        this.shoot();
      }, this.launcher.shootRepetition.delay);
    } else {
      this.time = 0;
    }
  }

  modifyConfetti(conf) {
    const newConf = JSON.parse(JSON.stringify({ ...conf }));

    if (newConf.shapeOptions.type == "image") {
      newConf.offscreenCanvas = conf.offscreenCanvas;
    }

    newConf.position = { ...this.launcher.position };

    const dir =
      Math.random() * (this.launcher.direction.end * Math.PI - this.launcher.direction.start * Math.PI) +
      this.launcher.direction.start * Math.PI;
    const strenght =
      Math.random() * (this.launcher.strength[1] - this.launcher.strength[0]) + this.launcher.strength[0];
    const velocity = [-Math.cos(dir) * strenght, -Math.sin(dir) * strenght];

    newConf.velocity.x = velocity[0];
    newConf.velocity.y = velocity[1];

    if (conf.randomRotation) {
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
    }

    if (newConf.randomColor && this.launcher.colors) {
      const index = Math.floor(Math.random() * this.launcher.colors.length);
      newConf.color = this.launcher.colors[index];
    }

    return newConf;
  }

  setPosition(x, y) {
    this.launcher.position.x = x;
    this.launcher.position.y = y;
  }
}
