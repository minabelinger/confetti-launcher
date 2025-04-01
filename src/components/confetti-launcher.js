import { ConfettiAnimator } from "./confetti-animator.js";

export class ConfettiLauncher {
  constructor(config, launcher, confList, canvas) {
    this.config = config;
    this.launcher = launcher;
    this.confList = confList;
    this.canvas = canvas;
    this.animator = undefined;
  }

  shoot() {
    if (!this.animator) {
      this.animator = new ConfettiAnimator(this.config, this.canvas);
    }
    this.animator.addConfettiToQueue(this.confList);
    console.log(this.animator.isPlaying);
    if (!this.animator.isPlaying) {
      this.animator.startAnimation();
    }
  }
}
