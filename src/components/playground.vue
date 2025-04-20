<script>
import { ConfettiLauncher } from "./confetti-launcher";

export default {
  data() {
    return {
      conf_launcher: null,
    };
  },
  mounted() {
    var conf = {
      shapeOptions: {
        type: "rectangle",
        width: "30",
        height: "10",
        image: {
          src: "src/assets/star-svgrepo-com.svg",
          composition: "source-atop",
        },
        shininess: 2,
        shadows: 0.1,
      },
      velocity: { x: 0, y: 0, maxFallspeed: 0, gravity: 0, airdrag: 20 },
      shading: true,
      randomRotation: true,
      randomColor: false,
      lifetime: {
        enabled: true,
        onset: 2,
        duration: 5,
        current: 0,
      },
    };

    const canvas = document.getElementById("playground");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const image = document.getElementById("image");
    const rect = image.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.width / 2;

    var launcher = {
      position: {
        x: x,
        y: y,
      },
      amount: [100, 100],
      strength: [100, 400],
      confetti: [conf],
      colors: ["#6beb34", "#4287f5", "#ca16de", "#41de16", "#de3116", "#f5d002"],
    };

    this.conf_launcher = new ConfettiLauncher(launcher, [conf], canvas);

    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    shoot() {
      if (this.conf_launcher) {
        this.conf_launcher.shoot();
      } else {
        console.warn("ConfettiLauncher not initialized correctly.");
      }
    },
    handleResize() {
      const canvas = document.getElementById("playground");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const image = document.getElementById("image");
      const rect = image.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.width / 2;

      if (this.conf_launcher) {
        this.conf_launcher.setPosition(x, y);
      }
    },
  },
};
</script>

<template>
  <button @click="shoot">Shoot</button>
  <img
    id="image"
    src="../assets/star-svgrepo-com.svg"
  />
  <canvas id="playground"></canvas>
</template>

<style scoped>
#playground {
  margin: 0;
  padding: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  pointer-events: none;
}

#image {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: auto;
  left: 50%;
  top: 50%;
}
</style>
