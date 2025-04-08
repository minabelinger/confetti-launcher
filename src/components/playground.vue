<script>
import { ConfettiLauncher } from "./confetti-launcher";

export default {
  data() {
    return {
      conf_launcher: null,
    };
  },
  mounted() {
    const config = {
      destroyDistance: 300,
      light_dir: [-1, -1, -0.5],
    };

    var conf = {
      color: "#6beb34",
      quaternion: {
        w: 1,
        x: 0,
        y: 0,
        z: 0,
      },
      quaternion_velocity: {
        w: 0,
        x: 5,
        y: 0,
        z: 0,
      },
      position: {
        x: 1000,
        y: 500,
      },
      shapeOptions: {
        type: "image",
        width: "40",
        height: "40",
        image: {
          src: "src/assets/star-svgrepo-com.svg",
          composition: "source-in",
        },
        shininess: 2,
        shadows: 0.5,
      },
      velocity: {
        maxFallspeed: 500,
        gravity: 250,
        airdrag: 20,
      },
      randomColor: true,
      lifetime: {
        enabled: true,
        onset: 1,
        duration: 4,
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
      direction: {
        start: 0,
        end: Math.PI * 2,
      },
      confetti: [conf],
      duration: 5,
      delay: 0.5,
      amount: [10, 10],
      strength: [100, 400],
      colors: ["#6beb34", "#4287f5", "#ca16de", "#41de16", "#de3116", "#f5d002"],
    };

    this.conf_launcher = new ConfettiLauncher(config, launcher, [conf], canvas);

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
        console.warn("ConfettiLauncher not initialized. Make sure mounted() ran successfully.");
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
    src="../assets/a11.png"
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
