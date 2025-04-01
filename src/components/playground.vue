<script>
import { onMounted, ref } from "vue";
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
        x: -0.4,
        y: 0,
        z: 0,
      },
      material_type: "shaded",
      position: {
        x: 1000,
        y: 500,
      },
      shapeOptions: {
        type: "ellipse",
        rx: "100",
        ry: "50",
      },
      lifetime: {
        enabled: false,
        time: 0.1,
      },
      velocity: {
        x: 20,
        y: -20,
        maxFallspeed: 20,
        fallspeed: 4,
        airdrag: 1,
      },
    };

    var launcher = {
      position: {
        x: 500,
        y: 500,
      },
      direction: {
        start: 0,
        end: Math.PI,
      },
      confetti: [conf],
      duration: 2,
      delay: 0.1,
      amount: [10, 15],
      strength: [5, 10],
    };

    const canvas = document.getElementById("playground");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.conf_launcher = new ConfettiLauncher(config, launcher, [conf], canvas);
  },
  methods: {
    shoot() {
      if (this.conf_launcher) {
        this.conf_launcher.shoot();
      } else {
        console.warn("ConfettiLauncher not initialized. Make sure onMounted() ran successfully.");
      }
    },
  },
};
</script>

<template>
  <button @click="shoot">Shoot</button>
  <canvas id="playground"></canvas>
</template>

<style scoped>
#playground {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
